import QRCode from "qrcode/lib/core/qrcode.js";

const ROOM_LIFETIME = 2 * 60 * 60 * 1000;
const PAYLOAD_LIMIT = 24000;
const CAPTION_LIMIT = 1400;
const RECENT_LIMIT = 12;
const TOKEN = /^[a-f0-9]{32}$/;
const assets = MALBIT_ASSETS;

const responseHeaders = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff"
};

function json(data, status = 200) {
  return Response.json(data, { status, headers: responseHeaders });
}

function newToken() {
  return crypto.randomUUID().replaceAll("-", "");
}

async function hash(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function makeQR(url) {
  const { modules } = QRCode.create(url, { errorCorrectionLevel: "M" });
  const size = modules.size + 8;
  let path = "";
  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (modules.get(row, col)) path += `M${col + 4} ${row + 4}h1v1h-1z`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="white"/><path d="${path}"/></svg>`;
  return "data:image/svg+xml;base64," + btoa(svg);
}

async function createRoom(db, origin, now) {
  const watch = newToken();
  const host = newToken();
  const expiresAt = now + ROOM_LIFETIME;
  const [watchKey, hostKey] = await Promise.all([hash(watch), hash(host)]);
  await db.batch([
    db.prepare("DELETE FROM caption_sessions WHERE expires_at <= ?").bind(now),
    db.prepare("INSERT INTO caption_sessions (watch_key, host_key, expires_at) VALUES (?, ?, ?)").bind(watchKey, hostKey, expiresAt)
  ]);
  const url = new URL("/watch#session=" + watch, origin).href;
  return json({ url, host, qr: makeQR(url), expiresAt }, 201);
}

async function readSnapshot(request) {
  if (!request.body || !/^application\/json(?:;|$)/i.test(request.headers.get("Content-Type") || "")) return;
  const stream = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = "";
  while (true) {
    const { value, done } = await stream.read();
    if (done) break;
    size += value.byteLength;
    if (size > PAYLOAD_LIMIT) {
      await stream.cancel();
      return;
    }
    body += decoder.decode(value, { stream: true });
  }
  try {
    const snapshot = JSON.parse(body + decoder.decode());
    const { revision, listening, captions, draft } = snapshot;
    const isCaption = (value) => typeof value === "string" && value.length <= CAPTION_LIMIT;
    if (Number.isSafeInteger(revision) && revision > 0 && typeof listening === "boolean" &&
        Array.isArray(captions) && captions.length <= RECENT_LIMIT && captions.every(isCaption) && isCaption(draft)) {
      return { revision, listening, captions, draft };
    }
  } catch {
    // Invalid JSON is handled as an invalid request.
  }
}

async function handleRoom(request, db, ctx, url) {
  const { method } = request;
  const now = Date.now();
  if (request.headers.get("Sec-Fetch-Site") === "cross-site") return json({ error: "origin" }, 403);
  const requestOrigin = request.headers.get("Origin");
  if (requestOrigin && requestOrigin !== url.origin) return json({ error: "origin" }, 403);
  if (method === "POST" && url.pathname === "/api/session") {
    // Browsers can only attach this header from the same origin, and we do not serve CORS.
    if (request.headers.get("X-Malbit") !== "room") return json({ error: "origin" }, 403);
    return createRoom(db, url.origin, now);
  }
  const token = request.headers.get("Authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token || !TOKEN.test(token)) return json({ error: "link" }, 401);
  const key = await hash(token);
  if (method === "GET" && url.pathname === "/api/watch") {
    const room = await db.prepare("SELECT caption_state AS state, revision, expires_at AS expiry FROM caption_sessions WHERE watch_key = ?").bind(key).first();
    if (room && room.expiry > now) return json({ ...JSON.parse(room.state), revision: room.revision, expiresAt: room.expiry });
    if (room) ctx.waitUntil(db.prepare("DELETE FROM caption_sessions WHERE watch_key = ? AND expires_at <= ?").bind(key, now).run());
    return json({ error: "ended" }, 410);
  }
  if (url.pathname !== "/api/session") return json({ error: "route" }, 404);
  if (method === "PUT") {
    const snapshot = await readSnapshot(request);
    if (!snapshot) return json({ error: "caption" }, 400);
    const { revision, ...state } = snapshot;
    const updated = await db.prepare(
      "UPDATE caption_sessions SET caption_state = ?, revision = ? WHERE host_key = ? AND expires_at > ? AND revision < ?"
    ).bind(JSON.stringify(state), revision, key, now, revision).run();
    if (updated.meta.changes) return new Response(null, { status: 204, headers: responseHeaders });
    const room = await db.prepare("SELECT revision FROM caption_sessions WHERE host_key = ? AND expires_at > ?").bind(key, now).first();
    if (room) return new Response(null, { status: 204, headers: responseHeaders });
    return json({ error: "ended" }, 410);
  }
  if (method === "DELETE") {
    await db.prepare("DELETE FROM caption_sessions WHERE host_key = ?").bind(key).run();
    return new Response(null, { status: 204, headers: responseHeaders });
  }
  return json({ error: "method" }, 405);
}

function serveAsset(method, path) {
  if (method !== "GET" && method !== "HEAD") return new Response(null, { status: 405 });
  const key = path === "/" ? "/index.html" : path === "/watch" || path === "/watch/" ? "/watch.html" : path;
  const asset = Object.hasOwn(assets, key) && assets[key];
  if (!asset) return new Response("Page not found.", { status: 404, headers: responseHeaders });
  return new Response(method === "HEAD" ? null : Uint8Array.from(atob(asset.bytes), (value) => value.charCodeAt(0)), {
    headers: {
      ...responseHeaders,
      "Content-Type": asset.type,
      "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; connect-src 'self' https://api.mymemory.translated.net; object-src 'none'; base-uri 'none'; form-action 'self'",
      "Permissions-Policy": path.startsWith("/watch") ? "microphone=()" : "microphone=(self)"
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/session" && url.pathname !== "/api/watch") return serveAsset(request.method, url.pathname);
    try {
      return await handleRoom(request, env.DB, ctx, url);
    } catch {
      console.error(JSON.stringify({ event: "caption_relay_error", method: request.method, path: url.pathname }));
      return json({ error: "unavailable" }, 503);
    }
  }
};
