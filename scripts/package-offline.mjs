// Bundle the static build into a single HTML file for the school presentation.
// No internet, Node runtime, web server or account is needed to open the result.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const jsPath = index.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[1];
const cssPath = index.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)?.[1];
if (!jsPath || !cssPath)
  throw new Error("Build the application before creating the offline demo.");
let js = fs.readFileSync(path.join(dist, jsPath), "utf8");
let css = fs.readFileSync(path.join(dist, cssPath), "utf8");
const embeddedImages = {};
for (const file of fs.readdirSync(path.join(dist, "images"))) {
  const url = "/images/" + file;
  const mime = file.endsWith(".jpg")
    ? "image/jpeg"
    : file.endsWith(".png")
      ? "image/png"
      : "image/svg+xml";
  const data =
    "data:" +
    mime +
    ";base64," +
    fs.readFileSync(path.join(dist, "images", file)).toString("base64");
  if (js.includes(url)) embeddedImages[url] = data;
  css = css.replaceAll(url, data);
}
if (css.includes("/images/"))
  throw new Error("An image reference was not embedded.");
const favicon =
  "data:image/svg+xml;base64," +
  fs.readFileSync(path.join(dist, "favicon.svg")).toString("base64");
const html =
  '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#102719"><link rel="icon" href="' +
  favicon +
  '"><title>FoodLoop · School prototype</title><style>' +
  css.replaceAll("</style", "<\\/style") +
  '</style></head><body><div id="root"></div><script type="module">' +
  "window.__foodloopImages=" +
  JSON.stringify(embeddedImages) +
  ";\n" +
  js.replaceAll("</script", "<\\/script") +
  "</script></body></html>";
const output = path.resolve(
  process.argv[2] ?? path.join(root, "..", "FoodLoop.html"),
);
fs.writeFileSync(output, html);
console.log(
  "Self-contained offline prototype created: " +
    output +
    " (" +
    Math.round(Buffer.byteLength(html) / 1024) +
    " KB)",
);
