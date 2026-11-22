"use strict";

const $ = (id) => document.getElementById(id);
const token = new URLSearchParams(location.hash.slice(1)).get("session") ?? "";
const scroll = $("caption-scroll");
const lines = $("lines");
const draft = $("draft");
let lastRevision = -1;
let lastCaption = "";
let scale = 1;
let retry = 1100;

function setStatus(state, label) {
  const status = $("status");
  status.dataset.state = state;
  if (status.lastElementChild.textContent !== label) status.lastElementChild.textContent = label;
}

function showEmpty(title, note) {
  $("empty").hidden = false;
  $("empty-title").textContent = title;
  $("empty-note").textContent = note;
}

function showClosed(invalid = false) {
  lines.replaceChildren();
  draft.hidden = true;
  draft.textContent = "";
  $("home").hidden = false;
  setStatus("idle", invalid ? "연결할 수 없음" : "연결 종료");
  showEmpty(
    invalid ? "연결 링크가 필요해요" : "자막 연결이 끝났어요",
    "상대방에게 새 QR 코드를 보여 달라고 해 주세요."
  );
}

function display(snapshot) {
  setStatus(snapshot.listening ? "live" : "idle", snapshot.listening ? "연결됨 · 듣는 중" : "연결됨 · 대기 중");
  if (!Array.isArray(snapshot.captions)) return;
  if (!snapshot.captions.length && !snapshot.draft) {
    showEmpty("자막을 기다리고 있어요", "상대방이 말하면 한국어 자막이 여기에 표시돼요.");
  }
  if (snapshot.revision <= lastRevision) return;
  lastRevision = snapshot.revision;

  const follow = scroll.scrollHeight - scroll.clientHeight - scroll.scrollTop < 76;
  const previousScroll = scroll.scrollTop;
  const captions = snapshot.captions;
  lines.replaceChildren(...captions.map((caption, index) => {
    const line = document.createElement("p");
    line.className = index === captions.length - 1 ? "line current" : "line";
    line.textContent = caption;
    return line;
  }));
  draft.textContent = snapshot.draft;
  draft.hidden = !snapshot.draft;
  $("empty").hidden = Boolean(captions.length || snapshot.draft);
  scroll.scrollTop = follow ? scroll.scrollHeight : previousScroll;

  const newest = captions[captions.length - 1] || "";
  if (newest && newest !== lastCaption) $("announcement").textContent = newest;
  lastCaption = newest;
}

async function watch() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch("/api/watch", {
      headers: { Authorization: "Bearer " + token },
      cache: "no-store",
      signal: controller.signal
    });
    if (response.status === 410 || response.status === 401) {
      showClosed();
      return;
    }
    if (!response.ok) throw new Error("connection");
    const snapshot = await response.json();
    display(snapshot);
    retry = snapshot.listening ? 850 : 1350;
  } catch {
    setStatus("error", "다시 연결 중");
    if (!lines.childElementCount && draft.hidden) showEmpty("다시 연결 중이에요", "인터넷 연결을 확인해 주세요.");
    retry = Math.min(6000, retry * 2);
  } finally {
    clearTimeout(timeout);
  }
  setTimeout(watch, retry);
}

function setScale(delta) {
  const follow = scroll.scrollHeight - scroll.clientHeight - scroll.scrollTop < 76;
  scale = Math.min(1.75, Math.max(.75, scale + delta));
  scroll.style.setProperty("--caption-scale", scale);
  $("smaller").disabled = scale <= .75;
  $("larger").disabled = scale >= 1.75;
  if (follow) scroll.scrollTop = scroll.scrollHeight;
}

$("smaller").addEventListener("click", () => setScale(-.25));
$("larger").addEventListener("click", () => setScale(.25));

if (/^[a-f0-9]{32}$/.test(token)) watch();
else showClosed(true);
