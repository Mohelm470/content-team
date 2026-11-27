// Schriften lokal aus npm (@fontsource, SIL Open Font License) – kein Netz beim Rendern nötig.
import {continueRender, delayRender} from "remotion";
import anton from "@fontsource/anton/files/anton-latin-400-normal.woff2";
import bangers from "@fontsource/bangers/files/bangers-latin-400-normal.woff2";
import lilita from "@fontsource/lilita-one/files/lilita-one-latin-400-normal.woff2";

const list: [string, string][] = [["Anton", anton], ["Bangers", bangers], ["Lilita One", lilita]];
if (typeof document !== "undefined") {
  const h = delayRender("Schriften laden");
  Promise.all(list.map(([fam, url]) => new FontFace(fam, `url(${url})`).load().then((f) => { (document.fonts as any).add(f); })))
    .then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
}
