# Malbit (말빛)

Malbit turns speech into live Korean captions. Use it on a shared screen or connect a second device as a Korean-only caption reader.

[Open the live site](https://malbit-live-captions.chaollapark.chatgpt.site/)

## Use two devices

1. Open Malbit on the speaker’s device in Chrome.
2. Select **Connect phone**, then **Create live QR**. Scan the code from the reader’s phone.
3. Start the microphone on the speaker’s device. The reader displays the Korean captions automatically.

The **Share** button distributes the site link. A live-session QR connects viewers to the current speaker’s captions. Use **End live session** to close that session.

## Build

```sh
npm ci
npm run build
```

The build bundles `public/` and `worker/index.js` into the Worker module at `dist/server/index.js`. The live caption relay requires a Cloudflare D1 binding named `DB`. Apply the schema in `drizzle/0000_caption_sessions.sql` to that database. The Sites manifest declares the binding for a separate deployment.

If you host your own copy, update the public share link in `public/index.html` and regenerate `public/share-qr.png` for its URL. Live-session QR codes use the address of the running app.

## Speech and caption handling

The speaker’s browser provides speech recognition. Translation uses Chrome’s on-device translator when ready and falls back to MyMemory. During a live session, the Worker relays recent Korean captions to devices with the session link. Session links expire after two hours and can be closed by the speaker.
