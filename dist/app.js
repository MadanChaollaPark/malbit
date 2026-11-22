"use strict";

const $ = (id) => document.getElementById(id);
const { t } = window.malbitI18n;
const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isAndroid = navigator.userAgentData?.platform === "Android" || /\bAndroid\b/i.test(navigator.userAgent);
const captionScroll = $("caption-scroll");
const lines = $("lines");
const draft = $("draft");
const language = $("language");
const reader = $("reader");
const mic = $("mic");
const readerStatus = $("reader-status");
const micNote = $("mic-note");

let session = null;
let example = null;
let latest = null;
let micError = "";
let typeRequest = null;
let captionSize = 1;
let expanded = false;

const translators = new Map();
const cachedTranslations = new Map();
let onlineLimitReached = false;

const stateLabels = {
  idle: ["start", "대기 중"],
  starting: ["cancel", "마이크 연결 중"],
  live: ["stop", "듣는 중"],
  reconnecting: ["stop", "마이크 다시 연결 중"],
  stopping: ["stopping", "마이크 끄는 중"],
  error: ["start", "마이크 연결을 확인해 주세요"]
};

function selectedName() {
  return language.selectedOptions[0].textContent;
}

function icon(button, name) {
  button.querySelector("use").setAttribute("href", "#i-" + name);
}

function refresh() {
  const active = Boolean(session);
  const phase = session?.phase || (micError ? "error" : "idle");
  const [micLabel, koreanLabel] = stateLabels[phase];
  const canListen = Boolean(speechRecognition && window.isSecureContext);
  mic.querySelector("span").textContent = t(micLabel);
  mic.dataset.active = String(active);
  mic.disabled = !canListen || phase === "stopping";
  icon(mic, active ? "stop" : "mic");
  language.disabled = active;
  $("clear").disabled = active || !lines.childElementCount;
  $("example").disabled = active || Boolean(example) || Boolean(latest);
  $("reader-stop").hidden = !active || !expanded;
  $("reader-stop").disabled = phase === "stopping";
  readerStatus.dataset.state = phase;
  if (readerStatus.lastElementChild.textContent !== koreanLabel) readerStatus.lastElementChild.textContent = koreanLabel;
  micNote.dataset.error = String(Boolean(micError) || !canListen);
  const note = t(micError || ({
    starting: "micStarting",
    live: "micLive",
    reconnecting: "micReconnecting",
    stopping: "micStopping"
  })[phase] || (canListen ? "micIdle" : "micUnavailable"));
  if (micNote.textContent !== note) micNote.textContent = note;
  const expandLabel = t(expanded ? "collapse" : "expand");
  $("expand").setAttribute("aria-label", expandLabel);
  $("expand").title = expandLabel;

  $("empty").hidden = Boolean(lines.childElementCount) || !draft.hidden;
  $("empty-title").textContent = phase === "live" ? "말씀해 주세요" : "자막이 여기에 표시됩니다";
  $("empty-note").textContent = phase === "live"
    ? "듣고 있어요. 한국어 자막이 여기에 표시돼요."
    : "마이크를 켜고 말하면 한국어로 번역돼요.";
}

function closeToLatest() {
  return captionScroll.scrollHeight - captionScroll.clientHeight - captionScroll.scrollTop < 76;
}

function updateCaption(change, force = false) {
  const follow = force || closeToLatest();
  change();
  refresh();
  if (follow) captionScroll.scrollTop = captionScroll.scrollHeight;
}

function removeExample() {
  if (!example) return;
  example.remove();
  example = null;
}

function addLine(text, { isExample = false, pending = false, label = "" } = {}) {
  const line = document.createElement("p");
  line.className = "line current";
  line.lang = "ko";
  line.dataset.pending = String(pending);
  if (label) {
    const annotation = document.createElement("span");
    annotation.className = "line-tag";
    annotation.textContent = label;
    line.append(annotation);
  }
  line.append(document.createTextNode(text));
  updateCaption(() => {
    if (isExample) {
      example = line;
    } else {
      removeExample();
      latest?.classList.remove("current");
      latest = line;
    }
    lines.append(line);
    while (lines.childElementCount > 120) lines.firstElementChild.remove();
  });
  return line;
}

function showErrorInLine(line, original, locale, error) {
  if (!line.isConnected) return;
  updateCaption(() => {
    line.dataset.pending = "false";
    line.dataset.error = "true";
    line.textContent = error.message === "quota"
      ? "오늘의 온라인 번역 한도에 도달했어요."
      : "이 문장을 번역하지 못했어요.";
    const source = document.createElement("span");
    source.className = "line-source";
    source.lang = locale;
    source.textContent = original;
    line.append(source);
    $("announcement").textContent = line.firstChild.textContent;
  });
}

function sourceCode(locale) {
  return locale === "zh-CN" ? locale : locale.split("-")[0];
}

function nativeTranslator(locale) {
  return translators.get(sourceCode(locale))?.instance;
}

function warmTranslator(locale) {
  const source = sourceCode(locale);
  if (source === "ko" || !window.Translator || translators.has(source)) return;
  const entry = { instance: null };
  translators.set(source, entry);
  (async () => {
    try {
      const pair = { sourceLanguage: source === "zh-CN" ? "zh" : source, targetLanguage: "ko" };
      if (await window.Translator.availability(pair) !== "unavailable") {
        entry.instance = await window.Translator.create({ ...pair, signal: AbortSignal.timeout(120000) });
      }
    } catch {
      // The online translator can serve captions while Chrome downloads its pack.
    }
  })();
}

function splitForOnline(text) {
  const chunks = [];
  const encoder = new TextEncoder();
  let chunk = "";
  let size = 0;
  for (const token of text.match(/\S+\s*|\s+/gu) || []) {
    const bytes = encoder.encode(token).length;
    if (size + bytes > 480 && chunk.trim()) {
      chunks.push(chunk.trim());
      chunk = "";
      size = 0;
    }
    if (bytes <= 480) {
      chunk += token;
      size += bytes;
      continue;
    }
    for (const character of token) {
      const length = encoder.encode(character).length;
      if (size + length > 480) {
        chunks.push(chunk.trim());
        chunk = "";
        size = 0;
      }
      chunk += character;
      size += length;
    }
  }
  if (chunk.trim()) chunks.push(chunk.trim());
  return chunks;
}

const decoder = document.createElement("textarea");

async function onlineTranslate(text, locale) {
  const translated = [];
  for (const part of splitForOnline(text)) {
    if (onlineLimitReached) throw new Error("quota");
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", part);
    url.searchParams.set("langpair", sourceCode(locale) + "|ko");
    const response = await fetch(url, {
      credentials: "omit",
      referrerPolicy: "no-referrer",
      cache: "no-store",
      signal: AbortSignal.timeout(7500)
    });
    if (response.status === 429) {
      onlineLimitReached = true;
      throw new Error("quota");
    }
    if (!response.ok) throw new Error("translate");
    const data = await response.json();
    if (data.quotaFinished || Number(data.responseStatus) === 429 || Number(data.responseStatus) === 403 && /limit|quota/i.test(data.responseDetails ?? "")) {
      onlineLimitReached = true;
      throw new Error("quota");
    }
    if (Number(data.responseStatus) !== 200 || !data.responseData?.translatedText) throw new Error("translate");
    decoder.innerHTML = data.responseData.translatedText;
    translated.push(decoder.value);
  }
  return translated.join(" ");
}

function translate(original, locale) {
  const source = sourceCode(locale);
  if (source === "ko") return Promise.resolve(original);
  const key = source + "\n" + original;
  if (cachedTranslations.has(key)) return cachedTranslations.get(key);
  const result = (async () => {
    const translator = nativeTranslator(locale);
    if (translator) {
      try {
        const output = await translator.translate(original, { signal: AbortSignal.timeout(7500) });
        if (output.trim()) return output;
      } catch {
        // Keep captions available if the browser model becomes unavailable.
      }
    }
    return onlineTranslate(original, locale);
  })();
  cachedTranslations.set(key, result);
  if (cachedTranslations.size > 24) cachedTranslations.delete(cachedTranslations.keys().next().value);
  result.catch(() => {
    if (cachedTranslations.get(key) === result) cachedTranslations.delete(key);
  });
  return result;
}

function finalize(original, locale) {
  const line = addLine("번역 중…", { pending: true });
  translate(original, locale).then((translated) => {
    if (!line.isConnected) return;
    updateCaption(() => {
      line.dataset.pending = "false";
      line.textContent = translated;
      $("announcement").textContent = translated;
    });
  }, (error) => showErrorInLine(line, original, locale, error));
}

function resetDraft(context) {
  context.version++;
  context.partial = "";
  context.lastPreview = "";
  clearTimeout(context.previewTimer);
  context.previewTimer = 0;
  draft.hidden = true;
  draft.textContent = "";
}

function queueDraft(context) {
  const local = Boolean(nativeTranslator(context.locale)) || sourceCode(context.locale) === "ko";
  if (context.previewTimer || context.previewing || (onlineLimitReached && !local)) return;
  const clean = context.partial.trim();
  const solid = /^(ja|zh|ko)/.test(context.locale) ? clean.length >= 5 : clean.split(/\s+/).length >= 3;
  if (!solid || clean === context.lastPreview) return;
  const interval = local ? 500 : 1550;
  const wait = Math.max(260, context.previewAt + interval - Date.now());
  context.previewTimer = setTimeout(async () => {
    context.previewTimer = 0;
    if (session !== context || context.phase === "stopping") return;
    const text = context.partial;
    if (!text || text === context.lastPreview) return;
    const version = context.version;
    context.previewing = true;
    context.previewAt = Date.now();
    context.lastPreview = text;
    try {
      const translated = await translate(text, context.locale);
      if (session === context && version === context.version && context.partial.startsWith(text)) {
        updateCaption(() => {
          draft.textContent = translated;
          draft.hidden = false;
        });
      }
    } catch {
      // Final captions show translation failures and retain the recognized text.
    } finally {
      context.previewing = false;
      if (session === context) queueDraft(context);
    }
  }, wait);
}

function finishSession(context, error = "") {
  if (session !== context) return;
  clearTimeout(context.restartTimer);
  clearTimeout(context.stopTimer);
  resetDraft(context);
  session = null;
  context.track?.stop();
  reader.dataset.speaking = "false";
  micError = error;
  refresh();
}

function captureFailure(reason) {
  return ({
    "not-allowed": "errPermission",
    "service-not-allowed": "errService",
    "audio-capture": "errDevice",
    "network": "errNetwork",
    "language-not-supported": "errLanguage"
  })[reason] || "errStopped";
}

function startCapture(context) {
  if (session !== context) return;
  const recognition = new speechRecognition();
  context.recognition = recognition;
  const seenFinal = new Set();
  let heard = false;
  let silence = false;
  let retryInPhraseMode = false;
  const isCurrent = () => session === context && context.recognition === recognition;

  recognition.lang = context.locale;
  recognition.continuous = !context.singlePhrase;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  const failCapture = (message) => {
    const partial = context.partial;
    finishSession(context, message);
    if (partial) finalize(partial, context.locale);
    recognition.abort();
  };

  recognition.onstart = () => {
    if (!isCurrent() || context.phase === "stopping") return;
    context.phase = "live";
    refresh();
  };
  recognition.onspeechstart = () => {
    if (isCurrent()) reader.dataset.speaking = "true";
  };
  recognition.onspeechend = () => {
    if (isCurrent()) reader.dataset.speaking = "false";
  };
  recognition.onresult = (event) => {
    if (!isCurrent()) return;
    const inProgress = [];
    const complete = [];
    for (let index = 0; index < event.results.length; index++) {
      const result = event.results[index];
      const text = result[0].transcript.trim();
      if (!result.isFinal) {
        if (text) inProgress.push(text);
      } else if (!seenFinal.has(index)) {
        seenFinal.add(index);
        if (text) complete.push(text);
      }
    }
    heard ||= Boolean(complete.length || inProgress.length);
    if (complete.length) {
      resetDraft(context);
      for (const text of complete) finalize(text, context.locale);
    }
    context.partial = inProgress.join(" ");
    if (!context.partial) {
      resetDraft(context);
      refresh();
    } else {
      queueDraft(context);
    }
  };
  recognition.onerror = (event) => {
    if (!isCurrent()) return;
    if (event.error === "no-speech") {
      silence = true;
      return;
    }
    if (context.phase === "stopping" && event.error === "aborted") return;
    if (retryInPhraseMode) return;
    if (isAndroid && !context.singlePhrase && context.phase !== "stopping" && !document.hidden &&
        (event.error === "aborted" || event.error === "audio-capture")) {
      retryInPhraseMode = true;
      context.phase = "reconnecting";
      refresh();
      // Wait for the browser to release the Android recognizer before starting again.
      context.restartTimer = setTimeout(() => {
        if (isCurrent()) failCapture("errAndroidSpeech");
      }, 1800);
      return;
    }
    failCapture(isAndroid && event.error === "aborted" ? "errAndroidSpeech" : captureFailure(event.error));
  };
  recognition.onend = () => {
    if (!isCurrent()) return;
    clearTimeout(context.restartTimer);
    const partial = context.partial;
    resetDraft(context);
    context.recognition = null;
    reader.dataset.speaking = "false";
    if (partial) finalize(partial, context.locale);
    if (context.phase === "stopping") {
      finishSession(context);
      return;
    }
    context.emptyCycles = heard ? 0 : context.emptyCycles + 1;
    if (isAndroid && !context.singlePhrase &&
        (retryInPhraseMode || (!silence && context.emptyCycles >= 2))) {
      context.singlePhrase = true;
      context.emptyCycles = 0;
    }
    if (context.emptyCycles >= 4) {
      finishSession(context, silence ? "errSilence" : isAndroid ? "errAndroidSpeech" : captureFailure("aborted"));
      return;
    }
    context.phase = "reconnecting";
    refresh();
    context.restartTimer = setTimeout(() => {
      if (isAndroid && document.hidden) {
        finishSession(context, "errAndroidSpeech");
        return;
      }
      startCapture(context);
    }, isAndroid ? 800 : 450);
  };

  try {
    if (context.track) recognition.start(context.track);
    else recognition.start();
  } catch {
    finishSession(context, captureFailure("audio-capture"));
  }
}

async function startMic() {
  const locale = language.value;
  const context = {
    locale, phase: "starting", partial: "", lastPreview: "",
    previewAt: 0, version: 0, emptyCycles: 0, singlePhrase: false
  };
  removeExample();
  micError = "";
  session = context;
  warmTranslator(locale);
  refresh();

  // Let Android's speech service own the microphone. Modern desktop Chrome accepts an audio track.
  if (isAndroid || typeof speechRecognition.available !== "function" || !navigator.mediaDevices?.getUserMedia) {
    startCapture(context);
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (session !== context) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }
    [context.track] = stream.getAudioTracks();
    context.track.addEventListener("ended", () => {
      finishSession(context, captureFailure("audio-capture"));
      context.recognition?.abort();
    }, { once: true });
    startCapture(context);
  } catch (error) {
    const reason = error.name === "NotAllowedError" || error.name === "SecurityError" ? "not-allowed" : "audio-capture";
    finishSession(context, captureFailure(reason));
  }
}

function stopMic() {
  const context = session;
  if (!context || context.phase === "stopping") return;
  context.phase = "stopping";
  clearTimeout(context.restartTimer);
  refresh();
  if (!context.recognition) {
    finishSession(context);
    return;
  }
  const completeStop = () => {
    if (session !== context) return;
    const partial = context.partial;
    finishSession(context);
    if (partial) finalize(partial, context.locale);
    context.recognition?.abort();
  };
  context.stopTimer = setTimeout(completeStop, 1850);
  try {
    context.recognition.stop();
  } catch {
    completeStop();
  }
}

function updateSize() {
  captionScroll.style.setProperty("--caption-scale", captionSize);
  $("smaller").disabled = captionSize <= .75;
  $("larger").disabled = captionSize >= 1.75;
}

function setExpanded(value) {
  expanded = value;
  const follow = closeToLatest();
  reader.classList.toggle("expanded", expanded);
  document.body.classList.toggle("expanded", expanded);
  for (const selector of [".masthead", ".intro", ".page-footer", "#speaker"]) {
    document.querySelector(selector).inert = expanded;
  }
  const button = $("expand");
  button.setAttribute("aria-pressed", String(expanded));
  icon(button, expanded ? "collapse" : "expand");
  refresh();
  if (follow) captionScroll.scrollTop = captionScroll.scrollHeight;
}

const typedDialog = $("type-dialog");
const typeStatus = $("type-status");
const message = $("message");

function openType() {
  $("type-label").textContent = t("messageIn").replace("{language}", selectedName());
  typeStatus.textContent = t("typeIdle");
  typeStatus.dataset.error = "false";
  typedDialog.showModal();
  message.focus();
}

$("type-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = message.value.trim();
  if (!text || typeRequest) return;
  const request = {};
  typeRequest = request;
  $("send").disabled = true;
  typeStatus.textContent = t("translating");
  typeStatus.dataset.error = "false";
  try {
    warmTranslator(language.value);
    const translation = await translate(text, language.value);
    if (typeRequest !== request) return;
    addLine(translation);
    $("announcement").textContent = translation;
    message.value = "";
    typedDialog.close();
  } catch (error) {
    if (typeRequest !== request) return;
    typeStatus.dataset.error = "true";
    typeStatus.textContent = t(error.message === "quota" ? "quota" : "translateFailed");
  } finally {
    if (typeRequest === request) {
      typeRequest = null;
      $("send").disabled = false;
    }
  }
});

typedDialog.addEventListener("close", () => {
  typeRequest = null;
  $("send").disabled = false;
});
document.querySelectorAll(".dialog-close").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
$("type").addEventListener("click", openType);
$("share").addEventListener("click", () => {
  $("share-status").textContent = "";
  $("share-dialog").showModal();
});
$("copy-link").addEventListener("click", async () => {
  const link = $("share-link");
  const status = $("share-status");
  try {
    await navigator.clipboard.writeText(link.value);
    status.textContent = t("copied");
  } catch {
    link.focus();
    link.select();
    status.textContent = t("copyFallback");
  }
});
$("help").addEventListener("click", () => $("help-dialog").showModal());
$("privacy").addEventListener("click", () => {
  $("privacy-details").open = true;
  $("help-dialog").showModal();
});
$("example").addEventListener("click", () => {
  const sample = "안녕하세요! 오늘 만나서 반가워요.";
  addLine(sample, { isExample: true, label: "예시 자막" });
  $("announcement").textContent = "예시 자막. " + sample;
});
$("clear").addEventListener("click", () => {
  updateCaption(() => {
    lines.replaceChildren();
    latest = null;
    example = null;
    $("announcement").textContent = "";
    cachedTranslations.clear();
  }, true);
});
$("smaller").addEventListener("click", () => updateCaption(() => {
  captionSize = Math.max(.75, captionSize - .25);
  updateSize();
}));
$("larger").addEventListener("click", () => updateCaption(() => {
  captionSize = Math.min(1.75, captionSize + .25);
  updateSize();
}));
$("expand").addEventListener("click", () => setExpanded(!expanded));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && expanded) {
    setExpanded(false);
    $("expand").focus();
  }
});
mic.addEventListener("click", () => session ? stopMic() : startMic());
$("reader-stop").addEventListener("click", () => {
  stopMic();
  $("expand").focus();
});
window.addEventListener("pagehide", () => {
  const current = session;
  if (!current) return;
  finishSession(current);
  current.recognition?.abort();
});
document.addEventListener("malbit:languagechange", refresh);

updateSize();
refresh();
