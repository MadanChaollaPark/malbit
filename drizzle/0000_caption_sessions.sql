CREATE TABLE caption_sessions (
  watch_key TEXT PRIMARY KEY NOT NULL,
  host_key TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  revision INTEGER NOT NULL DEFAULT 0,
  caption_state TEXT NOT NULL DEFAULT '{"listening":false,"captions":[],"draft":""}'
);
--> statement-breakpoint
CREATE INDEX caption_sessions_expiry ON caption_sessions (expires_at);
