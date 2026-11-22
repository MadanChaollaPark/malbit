# Malbit (말빛)

Malbit turns speech into live Korean captions on a shared screen. Korean is the default spoken language. You can choose another language before starting the microphone. Use **Site language** in the header to change the interface. That choice is saved in your browser.

[Open the live site](https://malbit-live-captions.chaollapark.chatgpt.site/)

Open Malbit in Chrome, choose the language you’ll speak, select **Start microphone**, and allow access. Use **Share** to copy the public link or show its QR code.

## Run locally

Serve the static files from `dist/` and open localhost on port 8764 in Chrome.

```sh
python3 -m http.server 8764 --bind 127.0.0.1 --directory dist
```

The speaker’s browser provides speech recognition. For speech in another language, Malbit uses Chrome’s on-device translator when ready and falls back to MyMemory.
(built it for a friend who is deaf he couldn't hear what I was saying so I asked openclaw to make a subtitlbe machine)
