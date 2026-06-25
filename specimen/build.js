// specimen/build.js — data.js から「タグ標本箱」を生成する
//
// 出力:
//   specimen/labels.html … 印刷用ラベルシート（切ってピン留めする物理標本箱用）
//   specimen/case.html   … 画面で眺めるデジタル標本ケース（HTML+CSS のみ・JS不要）
//
// 着想: HTMLタグを「分類学的に採集された昆虫」として扱う。
//   学名   = タグそのもの（<details> など）
//   目(Order) = category のラテン名
//   生息地 = そのタグが棲む場所（head/body/table…）
//   記載年 = 古種 / 新種(HTML5) / 新参種 / 絶滅危惧種
//
// 使い方:  node specimen/build.js

const fs = require("fs");
const vm = require("vm");
const path = require("path");

// ── data.js を読み込む ───────────────────────────────
const root = path.resolve(__dirname, "..");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(root, "data.js"), "utf8") + "\nthis.E=ELEMENTS;this.C=CATEGORIES;",
  ctx
);
const ELEMENTS = ctx.E;

// ── 分類（目 Order）: category → ラテン名/和名 ──────────
const ORDER = {
  structure:   { ja: "構造目", la: "Structuralia" },
  text:        { ja: "本文目", la: "Textualia" },
  inline:      { ja: "語句目", la: "Phrasealia" },
  list:        { ja: "列挙目", la: "Enumeralia" },
  table:       { ja: "格子目", la: "Tabularia" },
  form:        { ja: "入力目", la: "Formularia" },
  embed:       { ja: "埋込目", la: "Medialia" },
  interactive: { ja: "対話目", la: "Interactiva" },
  meta:        { ja: "不可視目", la: "Invisibilia" },
};

// ── 記載年（種の新旧）────────────────────────────────
const HTML5 = new Set("section article aside nav header footer main figure figcaption hgroup details summary mark time data wbr bdi ruby rt rp output progress meter datalist audio video source track canvas picture svg".split(" "));
const MODERN = new Set("dialog template slot search".split(" "));
const DEPRECATED = new Set(["marquee"]);
function statusOf(tag) {
  if (DEPRECATED.has(tag)) return { ja: "絶滅危惧種", la: "spec. relicta", dagger: true };
  if (MODERN.has(tag))     return { ja: "新参種",     la: "spec. recens",  dagger: false };
  if (HTML5.has(tag))      return { ja: "新種",       la: "spec. nova",    dagger: false };
  return                          { ja: "古種",       la: "spec. classica",dagger: false };
}

// ── 生息地（産地）───────────────────────────────────
const HAB = {
  head:"caput", title:"caput", meta:"caput", base:"caput", link:"caput", style:"caput", script:"caput",
  body:"corpus",
  caption:"tabula", colgroup:"tabula", col:"tabula", thead:"tabula", tbody:"tabula", tfoot:"tabula", tr:"tabula", td:"tabula", th:"tabula",
  li:"enumeratio", dt:"definitio", dd:"definitio",
  option:"selectus", optgroup:"selectus",
  source:"media", track:"media",
  summary:"capsula", rt:"rubrica", rp:"rubrica", area:"mappa", legend:"ager", figcaption:"figura", slot:"umbra",
};
const HAB_JA = {
  caput:"頭部 (head)", corpus:"体部 (body)", tabula:"表 (table)", enumeratio:"箇条 (list)",
  definitio:"定義 (dl)", selectus:"選択肢 (select)", media:"媒体 (audio/video)", capsula:"折畳 (details)",
  rubrica:"振仮名 (ruby)", mappa:"地図 (map)", ager:"区画 (fieldset)", figura:"図版 (figure)",
  formula:"書式 (form)", umbra:"影 (shadow DOM)",
};
function habitatOf(tag, cat) {
  if (HAB[tag]) return HAB[tag];
  if (cat === "form") return "formula";
  if (cat === "table") return "tabula";
  return "corpus";
}

// ── 採集対象のタグ集合（実在タグのみ）──────────────────
const CANONICAL = new Set(`a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta meter nav noscript object ol optgroup option output p picture pre progress q rp rt ruby s samp script search section select slot small source span strong style sub summary sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr svg marquee`.split(/\s+/));

// ── data.js から標本リストを組み立てる ─────────────────
const specimens = [];
const seen = new Set();
for (const e of ELEMENTS) {
  if (!/^</.test(e.display)) continue;            // タグ要素だけ（実体参照・属性は除外）
  let tokens;
  if (/^h1/.test(e.tag)) tokens = ["h1", "h2", "h3", "h4", "h5", "h6"];
  else tokens = e.tag.split("/").map(s => (s.trim().match(/^[a-zA-Z0-9]+/) || [""])[0].toLowerCase());
  for (const t of tokens) {
    if (!t || !CANONICAL.has(t) || seen.has(t)) continue;
    seen.add(t);
    const hab = habitatOf(t, e.category);
    specimens.push({
      tag: t,
      category: e.category,
      order: ORDER[e.category] || { ja: e.category, la: e.category },
      habLa: hab,
      habJa: HAB_JA[hab] || hab,
      status: statusOf(t),
    });
  }
}

// 目ごとにまとめる（採集箱の区画）。ORDER の定義順を尊重。
const orderKeys = Object.keys(ORDER).filter(k => specimens.some(s => s.category === k));
console.log("採集した標本数:", specimens.length);
orderKeys.forEach(k => console.log("  " + ORDER[k].ja + " (" + ORDER[k].la + "): " + specimens.filter(s => s.category === k).length));

// ── ヘルパ ───────────────────────────────────────────
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const tagStr = t => "&lt;" + t + "&gt;";
const dag = st => (st.dagger ? " †" : "");

// ── 1) 印刷用ラベルシート ─────────────────────────────
function buildLabels() {
  const labels = specimens.map(s => `      <figure class="label">
        <span class="pinhole">⊙</span>
        <span class="sp">${tagStr(s.tag)}</span>
        <span class="genus"><i>${s.order.la}</i> · ${s.order.ja}</span>
        <span class="loc">Hab. ${s.habJa}</span>
        <span class="det"><i>${s.status.la}</i> · ${s.status.ja}${dag(s.status)}</span>
        <span class="coll">coll. ＿＿＿＿　HTML&nbsp;Day</span>
      </figure>`).join("\n");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>タグ標本ラベル — 印刷して、切って、ピンで留める</title>
<style>
  :root { --ink:#222; --line:#999; }
  * { box-sizing: border-box; }
  body { margin:0; background:#e9e6dd; color:var(--ink);
    font-family:"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif; }
  .intro { max-width:760px; margin:0 auto; padding:24px 18px 8px; }
  .intro h1 { font-size:1.3rem; letter-spacing:.12em; margin:0 0 .4rem; }
  .intro p { font-size:.85rem; line-height:1.8; color:#444; margin:.3rem 0; }
  .sheet { background:#fff; max-width:210mm; margin:12px auto; padding:10mm;
    display:grid; grid-template-columns:repeat(4,1fr); gap:4mm;
    box-shadow:0 4px 30px -16px rgba(0,0,0,.5); }
  .label { border:1px dashed var(--line); border-radius:2px; padding:3mm 2mm;
    display:flex; flex-direction:column; align-items:center; text-align:center;
    gap:.6mm; break-inside:avoid; background:#fff; }
  .label .pinhole { font-size:6pt; color:#bbb; line-height:1; }
  .label .sp { font-family:"SFMono-Regular",Consolas,Menlo,monospace; font-size:11.5pt; margin:.3mm 0 1mm; white-space:nowrap; }
  .label .genus { font-size:7pt; color:#333; }
  .label .genus i { letter-spacing:.02em; }
  .label .loc, .label .det { font-size:6.5pt; color:#555; }
  .label .det i { color:#7a2d22; }
  .label .coll { margin-top:1.2mm; padding-top:1mm; border-top:.3pt solid #ccc;
    font-size:5.5pt; color:#888; letter-spacing:.04em; width:100%; }
  @media print {
    body { background:#fff; }
    .no-print { display:none !important; }
    .sheet { box-shadow:none; margin:0; padding:0; max-width:none;
      grid-template-columns:repeat(4,1fr); gap:3mm; }
    .label { border-color:#bbb; }
    @page { size:A4; margin:10mm; }
  }
</style>
</head>
<body>
  <div class="intro no-print">
    <h1>タグ標本ラベル</h1>
    <p>HTML5 のタグを、昆虫標本のように一匹ずつラベル化したものです。
    印刷して、点線で切り取り、箱の中にピンで留めてください。</p>
    <p>各ラベルには、学名（タグ）・<i>目(Order)</i>・生息地(Hab.)・記載の新旧(<i>det.</i>) を、
    本物の標本ラベル風の極小活字で刷ってあります。<b>coll.</b> の欄には、採集者＝あなたの名前を。</p>
    <p>計 ${specimens.length} 標本 ／ A4・4列。ブラウザの印刷（Ctrl/Cmd+P）から、余白「既定」で。</p>
  </div>
  <main class="sheet">
${labels}
  </main>
</body>
</html>
`;
}

// ── 2) 画面の標本ケース（HTML+CSS のみ）───────────────
function buildCase() {
  // タグ名から決定的な「手作業のゆらぎ」を作る（傾き）
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const wob = s => { const h = hash(s); const r = ((h % 1000) / 1000 * 4.4 - 2.2).toFixed(2); return `--r:${r}deg`; };
  const drawers = orderKeys.map(k => {
    const ord = ORDER[k];
    const bugs = specimens.filter(s => s.category === k).map(s => `      <figure class="specimen" style="${wob(tagStr(s.tag))}">
        <span class="pin"></span>
        <span class="bug">${tagStr(s.tag)}</span>
        <span class="card">
          <span class="lbl loc">
            <span class="g"><i>${ord.la}</i></span>
            <span class="d">Hab. ${s.habJa}</span>
          </span>
          <span class="lbl det"><i>${s.status.la}</i>${dag(s.status)}</span>
        </span>
      </figure>`).join("\n");
    return `    <section class="drawer">
      <h2 class="order"><span class="o-la">${ord.la}</span><span class="o-ja">${ord.ja}</span></h2>
      <div class="row">
${bugs}
      </div>
    </section>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HTMLタグ標本箱 — 眺めて、愛でる</title>
<style>
  * { box-sizing:border-box; }
  body { margin:0; padding:28px 16px 60px; color:#eae3d5;
    background:#160f08;
    background-image:radial-gradient(circle at 50% -10%, #2c2114, #110b06 70%);
    font-family:"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif; }
  .head { text-align:center; margin:0 auto 26px; max-width:900px; }
  .head h1 { font-size:1.5rem; letter-spacing:.2em; margin:.2rem 0; color:#f2ead9; }
  .head p { font-size:.8rem; color:#b6a589; letter-spacing:.06em; line-height:1.8; margin:.3rem 0; }
  .head a { color:#d9b48a; }

  /* 木箱の額縁: 角を留め継ぎ(45°)にした木枠＋木目 */
  .case { position:relative; max-width:980px; margin:0 auto; padding:24px;
    border-radius:6px;
    background:
      linear-gradient(180deg, rgba(255,238,205,.06), transparent 28%, transparent 72%, rgba(0,0,0,.14)),
      repeating-linear-gradient(90.5deg, rgba(0,0,0,.05) 0 1px, transparent 1px 2px),
      repeating-linear-gradient(91deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px, rgba(0,0,0,.06) 3px 6px),
      conic-gradient(from 45deg at 50% 50%,
        #46301f 0 90deg, #321f0e 90deg 180deg, #6f4d31 180deg 270deg, #7d5839 270deg 360deg);
    box-shadow:0 36px 90px -34px rgba(0,0,0,.85),
      inset 0 0 0 1px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.12); }

  /* ガラスの内側: 古びた羊皮紙の敷き紙（しみ・古いピン穴入り） */
  .glass { position:relative; overflow:hidden; border-radius:2px;
    padding:26px 24px 34px;
    background:
      radial-gradient(circle at 30% 40%, rgba(60,35,12,.20) 0 1.3px, transparent 1.8px) 11px 9px/79px 91px,
      radial-gradient(circle at 70% 60%, rgba(60,35,12,.16) 0 1.1px, transparent 1.6px) 40px 55px/103px 67px,
      radial-gradient(circle at 20% 75%, rgba(125,78,36,.12) 0 2.2px, transparent 3px) 23px 17px/123px 101px,
      radial-gradient(circle at 80% 22%, rgba(125,78,36,.09) 0 2.6px, transparent 3.4px) 61px 41px/151px 133px,
      radial-gradient(circle at 22% 28%, rgba(90,58,26,.06) 0 1.2px, transparent 1.4px) 0 0/13px 13px,
      linear-gradient(160deg,#ece0c0,#d9c499);
    box-shadow:inset 0 0 60px rgba(70,42,18,.30),
      inset 0 0 0 2px rgba(48,30,13,.6), inset 0 3px 9px rgba(40,26,12,.45); }
  /* ガラスの映り込み（前面のうすい光のすじ） */
  .glass::before { content:""; position:absolute; inset:0; pointer-events:none; z-index:6;
    background:linear-gradient(118deg,
      rgba(255,255,255,.20) 0%, rgba(255,255,255,.05) 15%,
      transparent 33%, transparent 67%,
      rgba(255,255,255,.06) 85%, rgba(255,255,255,.17) 100%); }
  /* ガラスの周辺減光・緑がかった縁・映り込みのムラ */
  .glass::after { content:""; position:absolute; inset:0; pointer-events:none; z-index:7;
    box-shadow:inset 0 0 70px rgba(16,26,16,.30), inset 0 0 0 1px rgba(170,205,180,.20);
    background:
      radial-gradient(120% 80% at 50% -12%, rgba(255,208,138,.15), transparent 55%),
      radial-gradient(130% 70% at 82% 6%, rgba(255,255,255,.10), transparent 42%),
      radial-gradient(80% 120% at -5% 110%, rgba(120,150,125,.09), transparent 55%); }
  .drawer { margin:0 0 26px; }
  .drawer:last-child { margin-bottom:0; }
  .order { display:flex; align-items:baseline; gap:.7em; margin:0 0 12px;
    border-bottom:1px solid rgba(80,52,28,.5); padding-bottom:4px; }
  .order .o-la { font-style:italic; font-size:1rem; color:#5b3c22; letter-spacing:.04em; }
  .order .o-ja { font-size:.7rem; color:#7c5733; letter-spacing:.18em; }

  .row { display:grid; grid-template-columns:repeat(auto-fill,minmax(124px,1fr));
    gap:38px 14px; padding:8px 4px 2px; }

  /* 一匹の標本: 虫ピン + 本体(タグ) + データラベル */
  .specimen { position:relative; display:flex; flex-direction:column; align-items:center;
    padding-top:15px; transition:transform .18s ease;
    transform:rotate(var(--r,0deg)); transform-origin:50% 6px; }
  .specimen:hover { transform:rotate(var(--r,0deg)) translateY(-4px); z-index:4; }
  /* 真鍮の虫ピン: 光沢のある頭 + シャフト */
  .pin { position:absolute; top:0; left:50%; width:11px; height:11px; margin-left:-5.5px;
    border-radius:50%;
    background:radial-gradient(circle at 33% 27%, #fff4cf 0 8%, #e6c570 27%, #ab8232 62%, #5e3f12 100%);
    box-shadow:2px 3px 4px rgba(0,0,0,.5), inset 0 -1.5px 2px rgba(60,35,5,.5), inset 0 1px 1px rgba(255,240,190,.8);
    z-index:5; }
  /* 真鍮ピンの軸: 標本とラベルを串刺しに貫く（隙間からのぞく） */
  .specimen::before { content:""; position:absolute; top:8px; left:50%; width:2px;
    height:calc(100% - 8px); margin-left:-1px;
    background:linear-gradient(90deg,#edd596 0%,#bd9344 42%,#7d5a1f 62%,#46300f 100%);
    box-shadow:2px 1px 2.5px rgba(0,0,0,.3); border-radius:0 0 1px 1px; z-index:0; }
  /* 標本そのもの（虫の体）: つやのある立体的なキチン質。タグ名は箔押し風 */
  .bug { position:relative; z-index:3; margin-top:15px;
    font-family:"SFMono-Regular",Consolas,Menlo,monospace; font-size:.88rem; letter-spacing:.01em;
    color:#f1e1ba; text-shadow:0 1px 0 rgba(0,0,0,.65), 0 0 5px rgba(120,80,30,.35);
    background:
      radial-gradient(55% 38% at 31% 16%, rgba(255,255,255,.5) 0 8%, rgba(255,255,255,.05) 32%, transparent 56%),
      radial-gradient(150% 120% at 50% 0%, rgba(255,238,205,.12), transparent 42%),
      radial-gradient(150% 110% at 50% 4%, rgba(95,150,120,.16), rgba(120,90,160,.09) 35%, transparent 60%),
      radial-gradient(120% 130% at 50% 50%, transparent 52%, rgba(0,0,0,.5) 100%),
      linear-gradient(180deg, #5d4528 0%, #3a2716 34%, #221507 70%, #140b04 100%);
    border:1px solid #110903; border-radius:12px/9px; padding:5px 11px;
    box-shadow:
      5px 11px 14px -6px rgba(18,11,4,.6),
      0 19px 18px -10px rgba(18,11,4,.45),
      inset 0 1px 1px rgba(255,238,198,.28),
      inset 0 -3px 6px rgba(0,0,0,.55);
    white-space:nowrap; text-align:center; }
  /* データラベル: 同じ真鍮ピンに串刺しの古紙2枚（採集地ラベル＋同定ラベル） */
  .card { position:relative; z-index:2; display:flex; flex-direction:column; align-items:center;
    gap:6px; margin-top:14px; line-height:1.5; letter-spacing:.02em; }
  .lbl { position:relative; text-align:center; font-size:.56rem; color:#5a3f25;
    background:
      radial-gradient(circle at 24% 68%, rgba(125,75,32,.17) 0 1.2px, transparent 1.7px) 4px 3px/19px 16px,
      radial-gradient(circle at 76% 30%, rgba(120,68,28,.13) 0 1px, transparent 1.5px) 11px 8px/23px 21px,
      radial-gradient(65% 80% at 82% 88%, rgba(120,80,40,.11), transparent 62%),
      repeating-linear-gradient(0deg, rgba(110,80,40,.05) 0 1px, transparent 1px 3px),
      linear-gradient(160deg,#f4e8ca,#e7d5ad);
    border:.5px solid rgba(120,85,40,.42); border-radius:2px; padding:4px 7px; min-width:96px;
    box-shadow:3px 6px 8px -5px rgba(40,26,10,.5), inset 0 0 9px rgba(140,100,55,.2); }
  /* ピン穴 */
  .lbl::before { content:""; position:absolute; top:2px; left:50%; width:3px; height:3px; margin-left:-1.5px;
    border-radius:50%; background:radial-gradient(circle at 50% 35%, #2a1a0a, #6a4a22);
    box-shadow:0 0 0 1px rgba(120,80,40,.22), inset 0 0 1px #000; }
  .lbl.loc { transform:rotate(-.7deg); }
  .lbl.det { transform:rotate(1.2deg); color:#8a3320; font-style:italic;
    border-color:rgba(150,52,40,.5);
    box-shadow:3px 6px 8px -5px rgba(40,26,10,.5), inset 3px 0 0 rgba(150,52,40,.5), inset 0 0 8px rgba(150,110,60,.16); }
  .card .g { display:block; font-style:italic; color:#3f2a17; font-size:.62rem; }
  .card .d { display:block; }

  .foot { text-align:center; margin:28px auto 0; max-width:760px;
    font-size:.72rem; color:#9c8b70; line-height:1.9; }
  .foot a { color:#d9b48a; }

  @media (max-width:560px) {
    .row { grid-template-columns:repeat(auto-fill,minmax(96px,1fr)); gap:26px 10px; }
    .case { padding:13px; }
    .glass { padding:14px 12px 20px; }
  }
</style>
</head>
<body>
  <header class="head">
    <h1>ＨＴＭＬ　タグ標本箱</h1>
    <p>HTML5 のタグを一匹ずつ採集し、目(Order)ごとに並べた標本ケース。<br>
    ただ眺めて、愛でるためのものです。${specimens.length} 標本収蔵。</p>
  </header>

  <main class="case">
    <div class="glass">
${drawers}
    </div>
  </main>

  <footer class="foot">
    <p><i>spec. relicta †</i> は廃止種（&lt;marquee&gt; のように、今も飛んでいる目撃例あり）。<br>
    <a href="labels.html">▸ 印刷用ラベルシート</a> ／ <a href="../index.html">▸ HTML 詩語辞典へ戻る</a></p>
  </footer>
</body>
</html>
`;
}

// ── 出力 ─────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, "labels.html"), buildLabels());
fs.writeFileSync(path.join(__dirname, "case.html"), buildCase());
console.log("生成完了: specimen/labels.html, specimen/case.html");
