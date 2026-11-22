"use strict";

(() => {
  const $ = (id) => document.getElementById(id);
  const dialog = $("pair-dialog");
  const button = $("pair");
  const status = $("pair-status");
  const createButton = $("pair-create");
  const endButton = $("pair-end");
  const captionList = $("lines");
  const draft = $("draft");
  const activeStates = new Set(["starting", "live", "reconnecting", "stopping"]);
  let room = null;

  function hostRequest(method, host, options = {}) {
    const { body, keepalive } = options;
    const headers = host ? { Authorization: "Bearer " + host } : { "X-Malbit": "room" };
    if (body) headers["Content-Type"] = "application/json";
    return fetch("/api/session", {
      method, headers, body, keepalive,
      signal: keepalive ? undefined : AbortSignal.timeout(7000)
    });
  }

  async function copyLink(input, message) {
    try {
      await navigator.clipboard.writeText(input.value);
      message.textContent = "Link copied.";
    } catch {
      input.focus();
      input.select();
      message.textContent = "Link selected. Copy it to share.";
    }
  }

  function showRoom() {
    button.dataset.active = String(Boolean(room));
    button.lastElementChild.textContent = room ? "Phone link" : "Connect phone";
    $("pair-active").hidden = !room;
    $("pair-setup").hidden = Boolean(room);
    if (room) {
      $("pair-link").value = room.url;
      $("pair-qr").src = room.qr;
    } else {
      $("pair-link").value = "";
      $("pair-qr").removeAttribute("src");
    }
  }

  function closeRoom(message) {
    if (!room) return;
    clearTimeout(room.timer);
    clearTimeout(room.expiryTimer);
    room = null;
    showRoom();
    status.textContent = message;
  }

  function publish() {
    const current = room;
    if (!current || current.ending) return;
    const captions = Array.from(captionList.children)
      .filter((line) => !current.previous.has(line) && line.dataset.pending !== "true" &&
        line.dataset.error !== "true" && !line.querySelector(".line-tag"))
      .slice(-12)
      .map((line) => line.textContent.slice(0, 480));
    const liveDraft = draft.hidden ? "" : draft.textContent;
    if (liveDraft !== current.previousDraft) current.previousDraft = "";
    const state = {
      listening: activeStates.has($("reader-status").dataset.state),
      captions,
      draft: liveDraft === current.previousDraft ? "" : liveDraft.slice(0, 480)
    };
    if (JSON.stringify(state) === current.queued) return;
    current.queued = JSON.stringify(state);
    current.state = state;
    schedule(current);
  }

  function schedule(current, delay = 650) {
    if (room !== current || current.ending || current.sending || current.timer || current.queued === current.delivered) return;
    current.timer = setTimeout(() => send(current), delay);
  }

  async function send(current) {
    current.timer = 0;
    if (room !== current || current.ending) return;
    const toSend = current.queued;
    current.sending = true;
    try {
      const snapshot = { ...current.state, revision: ++current.revision };
      const response = await hostRequest("PUT", current.host, { body: JSON.stringify(snapshot) });
      if (room !== current || current.ending) return;
      if (response.status === 410) {
        closeRoom("This session has expired. Create a new QR to reconnect.");
        return;
      }
      if (!response.ok) throw new Error("send");
      current.delivered = toSend;
      current.retry = 650;
      if (current.failed) status.textContent = "Live captions reconnected.";
      current.failed = false;
    } catch {
      if (room !== current || current.ending) return;
      current.failed = true;
      current.retry = Math.min(current.retry * 2, 5000);
      status.textContent = "Phone connection interrupted. Reconnecting…";
    } finally {
      current.sending = false;
      schedule(current, current.retry);
    }
  }

  button.addEventListener("click", () => {
    if (!room?.failed) status.textContent = "";
    dialog.showModal();
  });
  createButton.addEventListener("click", async () => {
    createButton.disabled = true;
    status.textContent = "Creating live QR…";
    const previous = new Set(captionList.children);
    const previousDraft = draft.hidden ? "" : draft.textContent;
    try {
      const response = await hostRequest("POST");
      if (!response.ok) throw new Error("create");
      const info = await response.json();
      room = {
        ...info, previous, previousDraft, revision: 0, retry: 650,
        expiryTimer: setTimeout(() => closeRoom("This session has expired. Create a new QR to reconnect."), Math.max(0, info.expiresAt - Date.now()))
      };
      showRoom();
      status.textContent = "";
      publish();
    } catch {
      status.textContent = "Couldn’t create a live QR. Check your connection and try again.";
    } finally {
      createButton.disabled = false;
    }
  });
  $("pair-copy").addEventListener("click", () => copyLink($("pair-link"), status));
  endButton.addEventListener("click", async () => {
    const current = room;
    if (!current || current.ending) return;
    current.ending = true;
    endButton.disabled = true;
    try {
      const response = await hostRequest("DELETE", current.host);
      if (!response.ok) throw new Error("end");
      closeRoom("Live session ended.");
    } catch {
      current.ending = false;
      status.textContent = "Couldn’t end the session. Try again.";
      schedule(current);
    } finally {
      endButton.disabled = false;
    }
  });
  window.addEventListener("pagehide", () => {
    if (!room) return;
    const host = room.host;
    closeRoom("");
    hostRequest("DELETE", host, { keepalive: true }).catch(() => {});
  });
  window.malbitPair = { publish, copyLink };
})();
