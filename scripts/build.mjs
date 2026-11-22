import { mkdir, readFile, readdir } from "node:fs/promises";
import { build } from "esbuild";

const types = {
  css: "text/css; charset=utf-8",
  html: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  png: "image/png",
  svg: "image/svg+xml"
};

const assets = {};
for (const name of (await readdir("public")).sort()) {
  const type = types[name.split(".").at(-1)];
  if (!type) throw new Error("Unknown asset type: " + name);
  assets["/" + name] = { type, bytes: (await readFile("public/" + name)).toString("base64") };
}

await mkdir("dist/server", { recursive: true });
await build({
  entryPoints: ["worker/index.js"],
  outfile: "dist/server/index.js",
  platform: "browser",
  format: "esm",
  bundle: true,
  legalComments: "eof",
  define: { MALBIT_ASSETS: JSON.stringify(assets) }
});
