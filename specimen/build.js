// specimen/build.js — data.js から「タグ標本箱」を生成する
//
// 出力:
//   index.html           … サイトの表紙＝デジタル標本ケース（ルートに出力）。
//   specimen/labels.html … 印刷用ラベルシート（切ってピン留めする物理標本箱用）
//   specimen/case.html   … 旧URLからの後方互換リダイレクト（→ /index.html）
//
//   ※ 表紙＝標本箱。「辞書として読む（めくる・一覧・検索）」モードは dictionary.html。
//   かつての画面標本ケースは下記のとおり。
//                          静的部分は HTML+CSS のみ（JS無効でも完全に成立）。
//                          JS有効時のみ、辞書としての機能が段階的に乗る:
//                          ・標本をクリック→観察票（定義/詩/けしかけ/生きた標本）
//                          ・二匹を交配→組み合わせの問い（STRATEGIES×THEMES）
//                          ・種をまく→偶然の組を引く
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
  fs.readFileSync(path.join(root, "data.js"), "utf8") + "\nthis.E=ELEMENTS;this.C=CATEGORIES;this.S=STRATEGIES;this.T=THEMES;",
  ctx
);
const ELEMENTS = ctx.E;
const STRATEGIES = ctx.S;
const THEMES = ctx.T;

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
  if (DEPRECATED.has(tag)) return { ja: "絶滅危惧種", la: "spec. relicta", dagger: true,  key: "relicta" };
  if (MODERN.has(tag))     return { ja: "新参種",     la: "spec. recens",  dagger: false, key: "recens" };
  if (HTML5.has(tag))      return { ja: "新種",       la: "spec. nova",    dagger: false, key: "nova" };
  return                          { ja: "古種",       la: "spec. classica",dagger: false, key: "classica" };
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
      // 辞書の中身（観察票・交配で使う）
      summary: e.summary || "",
      poetic: e.poetic || "",
      spark: e.spark || "",
      demo: e.demo || "",
      note: e.note || "",
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
    <p><a href="../index.html">▸ 標本箱（表紙）へ戻る</a></p>
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
    const bugs = specimens.filter(s => s.category === k).map(s => `      <figure class="specimen st-${s.status.key}" data-tag="${s.tag}" tabindex="0" role="button" aria-label="${s.tag} を観察する" style="${wob(tagStr(s.tag))}">
        <span class="pin"></span>
        <span class="bug">${tagStr(s.tag)}<i class="seal" aria-hidden="true">蔵</i></span>
        <span class="card">
          <span class="lbl">
            <span class="g"><i>${ord.la}</i></span>
            <span class="d">Hab. ${s.habJa}</span>
            <span class="det"><i>${s.status.la}</i>${dag(s.status)}</span>
          </span>
        </span>
      </figure>`).join("\n");
    return `    <section class="drawer">
      <h2 class="order"><span class="o-la">${ord.la}</span><span class="o-ja">${ord.ja}</span></h2>
      <div class="row">
${bugs}
      </div>
    </section>`;
  }).join("\n");

  // 辞書の中身をページに埋め込む（観察票・交配・種まきで使う）
  const dictData = {
    specimens: specimens.map(s => ({
      tag: s.tag,
      display: tagStr(s.tag),
      orderLa: s.order.la, orderJa: s.order.ja,
      habJa: s.habJa,
      statusLa: s.status.la, statusJa: s.status.ja, dagger: !!s.status.dagger,
      summary: s.summary, poetic: s.poetic, spark: s.spark, demo: s.demo, note: s.note,
    })),
    strategies: STRATEGIES,
    themes: THEMES,
  };
  // <script> を壊さないよう < を退避してから埋める
  const dictJson = JSON.stringify(dictData)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

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

  /* 黒檀の額縁: 漆黒の枠に細い金の見切り線（羊皮紙を映えさせる） */
  .case { position:relative; max-width:980px; margin:0 auto; padding:24px;
    border-radius:6px;
    background:
      linear-gradient(180deg, rgba(255,255,255,.04), transparent 16%, transparent 84%, rgba(0,0,0,.28)),
      repeating-linear-gradient(90deg, rgba(255,255,255,.014) 0 1px, transparent 1px 4px),
      linear-gradient(135deg,#1c1611,#0c0907 50%,#1c1611);
    box-shadow:0 36px 90px -34px rgba(0,0,0,.85),
      inset 0 0 0 1px rgba(0,0,0,.6),
      inset 0 0 0 12px #100c08,
      inset 0 0 0 13px rgba(203,164,80,.9),
      inset 0 0 0 15px rgba(0,0,0,.45); }

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
  /* フィルムの粒状感: 全体に微細なノイズを乗せ「ベクター塗り」感を消す */
  .grain { position:absolute; inset:0; pointer-events:none; z-index:8;
    mix-blend-mode:overlay; opacity:.5;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E"); }
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
    padding-top:12px; transition:transform .18s ease;
    transform:rotate(var(--r,0deg)); transform-origin:50% 6px; }
  .specimen:hover { transform:rotate(var(--r,0deg)) translateY(-4px); z-index:4; }
  /* 真鍮の虫ピン: 上が丸く下は平たい甲丸(ドーム)の頭 */
  .pin { position:absolute; top:0; left:50%; width:8px; height:6px; margin-left:-4px;
    border-radius:50% 50% 42% 42% / 72% 72% 30% 30%;
    background:radial-gradient(120% 135% at 38% 16%, #fff6d6 0 18%, #eccd7e 42%, #a87f30 76%, #4e3410 100%);
    box-shadow:1px 1.5px 2.5px rgba(0,0,0,.5), inset 0 -1.5px 1.5px rgba(60,35,5,.6), inset 0 1px 1px rgba(255,242,196,.95);
    z-index:6; }
  /* 真鍮ピンの軸: 金属の鏡面ハイライトを持つ細い丸棒 */
  .specimen::before { content:""; position:absolute; top:5px; left:50%; width:1.7px;
    height:calc(100% - 5px); margin-left:-.85px;
    background:linear-gradient(90deg,#2c1d0b 0%,#9c7733 22%,#f4e3b4 47%,#a17c34 70%,#3d2a10 100%);
    box-shadow:1.1px 0 1.6px rgba(0,0,0,.32); z-index:0; }
  /* 標本そのもの（虫の体）: 艶を抑えたマットな暗色の名札。紙ラベルと素材で対比。タグ名は箔押し風 */
  .bug { position:relative; z-index:3; margin-top:11px;
    font-family:"SFMono-Regular",Consolas,Menlo,monospace; font-size:.88rem; letter-spacing:.01em;
    color:#ecdfc2; text-shadow:0 1px 0 rgba(0,0,0,.85);
    background:linear-gradient(180deg, #2d2214, #190f08);
    border:1px solid #0d0703; border-radius:4px; padding:6px 11px 5px;
    box-shadow:
      5px 10px 13px -6px rgba(18,11,4,.55),
      0 16px 16px -10px rgba(18,11,4,.4),
      inset 0 1px 0 rgba(255,230,180,.12),
      inset 0 -1px 2px rgba(0,0,0,.5);
    white-space:nowrap; text-align:center; }
  /* ピンが沈む所の影だけ（穴は描かない） */
  .bug::before { content:""; position:absolute; top:3px; left:50%; width:6px; height:3.5px; margin-left:-3px;
    border-radius:50%;
    background:radial-gradient(closest-side, rgba(0,0,0,.6), rgba(0,0,0,.25) 60%, transparent 100%);
    filter:blur(.6px); z-index:3; }
  /* 体に入っていく真鍮軸（前面の短い区間）＋その落ち影 */
  .bug::after { content:""; position:absolute; top:-8px; left:50%; width:1.7px; height:10px; margin-left:-.85px;
    background:linear-gradient(90deg,#2c1d0b,#9c7733 22%,#f4e3b4 47%,#a17c34 70%,#3d2a10);
    box-shadow:1.4px 1px 2px rgba(0,0,0,.45); z-index:4; }
  /* データラベル: 同じ真鍮ピンに串刺しの古紙2枚（採集地ラベル＋同定ラベル） */
  .card { position:relative; z-index:2; display:flex; flex-direction:column; align-items:center;
    gap:6px; margin-top:9px; line-height:1.5; letter-spacing:.02em; }
  .lbl { position:relative; text-align:center; font-size:.56rem; color:#5a3f25;
    background:
      radial-gradient(circle at 24% 68%, rgba(125,75,32,.17) 0 1.2px, transparent 1.7px) 4px 3px/19px 16px,
      radial-gradient(circle at 76% 30%, rgba(120,68,28,.13) 0 1px, transparent 1.5px) 11px 8px/23px 21px,
      radial-gradient(65% 80% at 82% 88%, rgba(120,80,40,.11), transparent 62%),
      linear-gradient(160deg,#f4e8ca,#e7d5ad);
    border:.5px solid rgba(120,85,40,.42); border-radius:2px; padding:11px 8px 5px; min-width:96px;
    box-shadow:3px 6px 8px -5px rgba(40,26,10,.5), inset 0 0 9px rgba(140,100,55,.2); }
  /* ピンが紙に沈む所の影だけ（穴は描かない） */
  .lbl::before { content:""; position:absolute; top:6px; left:50%; width:5px; height:3px; margin-left:-2.5px;
    border-radius:50%;
    background:radial-gradient(closest-side, rgba(48,28,8,.55), rgba(48,28,8,.2) 60%, transparent 100%);
    filter:blur(.5px); z-index:3; }
  /* 紙に入っていく真鍮軸（前面の短い区間）＋その落ち影 */
  .lbl::after { content:""; position:absolute; top:-4px; left:50%; width:1.7px; height:11px; margin-left:-.85px;
    background:linear-gradient(90deg,#2c1d0b,#9c7733 22%,#f4e3b4 47%,#a17c34 70%,#3d2a10);
    box-shadow:1.6px 1px 2px rgba(0,0,0,.4); z-index:4; }
  .lbl { transform:rotate(-.6deg); transform-origin:50% 5px; }
  /* 画面では目名(genus)を省く: 引き出しの見出しと重複し単調になるため。
     観察票・印刷ラベルには従来どおり全情報を載せる。 */
  .card .g { display:none; }
  .card .d { display:block; }
  .card .det { display:block; margin-top:3px; padding-top:3px;
    border-top:.5px solid rgba(120,85,40,.28);
    color:#6a4f30; font-style:italic; }
  /* 種の新旧を示す同定ドット（採集者が貼る色ラベルの見立て） */
  .card .det::before { content:""; display:inline-block; width:6px; height:6px; border-radius:50%;
    margin-right:5px; vertical-align:middle; background:#9c7b4a; box-shadow:inset 0 0 0 1px rgba(0,0,0,.18); }
  .st-nova    .card .det { color:#4f7a45; }
  .st-recens  .card .det { color:#3f6f7a; }
  .st-relicta .card .det { color:#a8442a; }
  .st-nova    .card .det::before, .legend .k-nova    i { background:#5f8a5a; }
  .st-recens  .card .det::before, .legend .k-recens  i { background:#4f7d8a; }
  .st-relicta .card .det::before, .legend .k-relicta i { background:#a8442a; }
  .legend .k-classica i { background:#9c7b4a; }
  /* 凡例 */
  .legend { margin:.6rem 0 0; font-size:.68rem; color:#b6a589; letter-spacing:.04em;
    display:flex; flex-wrap:wrap; gap:4px 14px; justify-content:center; }
  .legend span { display:inline-flex; align-items:center; }
  .legend i { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:5px;
    box-shadow:inset 0 0 0 1px rgba(0,0,0,.25); }

  .foot { text-align:center; margin:28px auto 0; max-width:760px;
    font-size:.72rem; color:#9c8b70; line-height:1.9; }
  .foot a { color:#d9b48a; }

  /* ── 辞書としての復活：観察票（拡大鏡）＋交配台 ── */
  .head-hint[hidden] { display:none; }
  .head-hint { font-size:.72rem; color:#c9b48f; letter-spacing:.04em; margin:.5rem 0 0; }
  .js-on .specimen { cursor:zoom-in; }

  body.loupe-open { overflow:hidden; }
  .loupe[hidden] { display:none; }
  .loupe { position:fixed; inset:0; z-index:50; display:flex; align-items:center; justify-content:center; padding:20px; }
  .loupe-back { position:absolute; inset:0; background:rgba(12,8,4,.74); }
  .loupe-card { position:relative; z-index:1; width:min(560px,94vw); max-height:88vh; overflow:auto;
    background:linear-gradient(160deg,#f4e8ca,#e7d5ad); color:#43301c; border-radius:4px;
    border:1px solid rgba(120,85,40,.5);
    box-shadow:0 30px 80px -20px rgba(0,0,0,.8), inset 0 0 0 6px rgba(255,255,255,.16), inset 0 0 40px rgba(150,110,60,.18);
    padding:22px 24px 26px; font-family:"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif; }
  .loupe-x { position:absolute; top:8px; right:12px; border:none; background:none; font-size:1.15rem; color:#7a5226; cursor:pointer; line-height:1; }
  .lc-head { text-align:center; border-bottom:1px solid rgba(120,85,40,.35); padding-bottom:10px; margin-bottom:6px; }
  .lc-name { display:block; font-family:"SFMono-Regular",Consolas,Menlo,monospace; font-size:1.5rem; color:#2a1c10; }
  .lc-tax { display:block; margin-top:5px; font-size:.72rem; color:#7c5733; }
  .lc-tax i { color:#5b3c22; }
  .lc-body { margin:0 0 6px; }
  .lc-body dt { font-size:.64rem; letter-spacing:.16em; color:#8a6a3c; margin:11px 0 3px; }
  .lc-body dd { margin:0; font-size:.9rem; line-height:1.75; color:#3f2a17; }
  .lc-body .lc-spark { color:#8a3320; font-style:italic; }
  .lc-demo { margin-top:14px; border:1px solid rgba(120,85,40,.4); border-radius:3px; overflow:hidden; }
  .lc-demo-strip { font-size:.6rem; letter-spacing:.1em; color:#f4ead6; background:linear-gradient(90deg,#6f4d31,#46301f); padding:4px 9px; }
  .lc-demo-live { padding:14px; background:#fffdf7; color:#1c140a; font-family:system-ui,-apple-system,sans-serif; font-size:.92rem; line-height:1.6; }
  .lc-demo-live * { max-width:100%; }
  .lc-demo-src { border-top:1px dashed rgba(120,85,40,.4); background:#fffdf7; }
  .lc-demo-src summary { cursor:pointer; font-size:.66rem; color:#7a5226; padding:6px 9px; }
  .lc-demo-code { margin:0; padding:10px 12px; background:#241a0e; color:#e8dcc2;
    font-family:"SFMono-Regular",Consolas,Menlo,monospace; font-size:.7rem; line-height:1.55;
    overflow:auto; white-space:pre-wrap; word-break:break-word; }
  .lc-actions { margin-top:16px; display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
  .lc-actions button { font-family:inherit; font-size:.78rem; color:#f3e9d2;
    background:linear-gradient(180deg,#6f4d31,#46301f); border:1px solid #2c1c0d; border-radius:4px;
    padding:7px 14px; cursor:pointer; transition:background .15s; }
  .lc-actions button:hover { background:linear-gradient(180deg,#7d5839,#503723); }
  .lc-actions button.is-on { background:linear-gradient(180deg,#9a3a23,#5e2114); }

  .cross-tray[hidden] { display:none; }
  .cross-tray { position:fixed; right:16px; bottom:16px; z-index:40; width:min(332px,92vw);
    background:linear-gradient(160deg,#efe2c0,#ddc79c); color:#43301c;
    border:1px solid rgba(90,60,30,.5); border-radius:6px;
    box-shadow:0 18px 50px -16px rgba(0,0,0,.7), inset 0 0 0 1px rgba(255,255,255,.2);
    font-family:"Hiragino Mincho ProN","Yu Mincho",serif; overflow:hidden; }
  .ct-head { display:flex; align-items:center; gap:8px; padding:8px 10px; background:linear-gradient(90deg,#6f4d31,#46301f); color:#f4ead6; }
  .ct-title { font-size:.78rem; letter-spacing:.1em; flex:1; }
  .ct-title .ct-count { opacity:.7; font-size:.7rem; }
  .ct-seed, .ct-min { font-family:inherit; background:rgba(255,255,255,.14); color:#f4ead6;
    border:1px solid rgba(255,255,255,.25); border-radius:3px; cursor:pointer; font-size:.72rem; padding:3px 8px; }
  .ct-chips { display:flex; flex-wrap:wrap; gap:6px; padding:10px; }
  .ct-empty { font-size:.66rem; color:#6a4f30; line-height:1.7; }
  .ct-chip { display:inline-flex; align-items:center; gap:5px;
    font-family:"SFMono-Regular",Consolas,Menlo,monospace; font-size:.74rem;
    background:#2d2214; color:#ecdfc2; border-radius:3px; padding:3px 7px; cursor:zoom-in; }
  .ct-rm { background:none; border:none; color:#d8b48a; cursor:pointer; font-size:.72rem; padding:0; line-height:1; }
  .ct-prov { padding:0 10px 12px; }
  .pv { background:rgba(255,252,244,.55); border:1px solid rgba(120,85,40,.35); border-radius:3px; padding:9px 11px; }
  .pv-label { display:block; font-size:.6rem; letter-spacing:.16em; color:#8a6a3c; margin-bottom:5px; }
  .pv-text { margin:0; font-size:.82rem; line-height:1.75; color:#3f2a17; }
  .pv-text b { color:#2a1c10; }
  .pv-acts { margin-top:9px; display:flex; gap:8px; }
  .pv-acts button { font-family:inherit; font-size:.68rem; color:#5a3f25; background:rgba(120,85,40,.14);
    border:1px solid rgba(120,85,40,.35); border-radius:3px; padding:4px 10px; cursor:pointer; }
  .cross-tray.min .ct-chips, .cross-tray.min .ct-prov { display:none; }
  .pv-memo { color:#3f2a17 !important; }

  /* しおり（収蔵）: 朱の蔵印 */
  .bug .seal { position:absolute; top:-5px; right:-5px; display:none; z-index:6;
    width:13px; height:13px; line-height:13px; text-align:center; font-style:normal;
    font-family:"Hiragino Mincho ProN",serif; font-size:8px; color:#fff;
    background:radial-gradient(circle at 40% 32%, #c75a3c, #7e2414 78%); border-radius:50%;
    box-shadow:0 1px 2px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,235,200,.3); }
  .specimen.is-kept .bug .seal { display:block; }

  /* 収蔵箱: 収蔵した標本だけを別の箱に並べ直す */
  .kept-case[hidden] { display:none; }
  .kept-case { position:fixed; inset:0; z-index:45; overflow:auto;
    display:flex; align-items:flex-start; justify-content:center; padding:30px 16px 48px; }
  .kc-back { position:fixed; inset:0; background:rgba(10,7,3,.82); }
  .kc-panel { position:relative; z-index:1; width:min(900px,96vw); }
  .kc-bar { display:flex; align-items:center; gap:10px; margin:0 0 12px; }
  .kc-title { flex:1; font-family:"Hiragino Mincho ProN","Yu Mincho",serif; color:#f0e6d2;
    font-size:1rem; letter-spacing:.12em; }
  .kc-x, .kc-print { font-family:"Hiragino Mincho ProN","Yu Mincho",serif;
    background:rgba(255,255,255,.12); color:#f0e6d2; border:1px solid rgba(255,255,255,.25);
    border-radius:4px; cursor:pointer; font-size:.78rem; padding:5px 11px; }
  .kc-print { background:linear-gradient(180deg,#6f4d31,#46301f); }
  .kc-inner { margin:0 !important; }
  /* 収蔵箱では蔵印は出さない（選定済みなので不要） */
  #keptCase .bug .seal { display:none !important; }
  .kc-empty { color:#c9b48f; font-family:"Hiragino Mincho ProN",serif; font-size:.8rem; text-align:center; padding:30px 0; }

  /* 収蔵バッジ（右上） */
  .keep-badge[hidden] { display:none; }
  .keep-badge { position:fixed; top:14px; right:16px; z-index:41; font-family:"Hiragino Mincho ProN",serif;
    font-size:.74rem; color:#f3e9d2; background:linear-gradient(180deg,#6f4d31,#46301f);
    border:1px solid #2c1c0d; border-radius:14px; padding:5px 12px; cursor:pointer;
    box-shadow:0 6px 16px -8px rgba(0,0,0,.7); }
  .keep-badge.active { background:linear-gradient(180deg,#a8442a,#6e2010); }
  .keep-badge .kb-n { font-weight:700; }

  /* トースト */
  .toast { position:fixed; left:50%; bottom:84px; transform:translateX(-50%) translateY(8px);
    z-index:60; background:rgba(30,20,10,.92); color:#f4ead6; font-family:"Hiragino Mincho ProN",serif;
    font-size:.78rem; padding:8px 16px; border-radius:4px; border:1px solid rgba(200,170,120,.3);
    opacity:0; pointer-events:none; transition:opacity .2s, transform .2s; }
  .toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

  /* 交配台ランチャー（普段はこの小ボタンだけ。押すと交配台が開く） */
  .cross-btn[hidden] { display:none; }
  .cross-btn { position:fixed; right:16px; bottom:16px; z-index:40; font-family:"Hiragino Mincho ProN",serif;
    font-size:.76rem; color:#f3e9d2; background:linear-gradient(180deg,#6f4d31,#46301f);
    border:1px solid #2c1c0d; border-radius:16px; padding:7px 14px; cursor:pointer;
    box-shadow:0 8px 18px -8px rgba(0,0,0,.7); }
  .cross-btn .cb-n { display:none; font-weight:700; margin-left:4px;
    background:#9a3a23; color:#fff; border-radius:9px; padding:0 6px; }
  .cross-btn.has .cb-n { display:inline; }

  /* 印刷: 単票は専用iframeで出すので、本体側は念のためフロート類を隠すだけ */
  @media print {
    .cross-tray, .cross-btn, .keep-badge, .toast, .loupe, .kept-case, .head-hint { display:none !important; }
  }

  /* 開閉の動き（軽いフェード＋ポップ）とフォーカス枠 */
  @keyframes ov-fade { from { opacity:0; } to { opacity:1; } }
  @keyframes ov-pop { from { opacity:0; transform:translateY(10px) scale(.985); } to { opacity:1; transform:none; } }
  .loupe:not([hidden]) .loupe-back, .kept-case:not([hidden]) .kc-back { animation:ov-fade .2s ease both; }
  .loupe:not([hidden]) .loupe-card, .kept-case:not([hidden]) .kc-panel { animation:ov-pop .2s cubic-bezier(.2,.7,.3,1) both; }
  .cross-tray:not([hidden]) { animation:ov-pop .16s ease both; }
  /* 観察票のめくり（左右）の切替アニメ */
  @keyframes slide-next { from { opacity:.25; transform:translateX(26px); } to { opacity:1; transform:none; } }
  @keyframes slide-prev { from { opacity:.25; transform:translateX(-26px); } to { opacity:1; transform:none; } }
  .lc-nav { position:absolute; top:50%; transform:translateY(-50%); z-index:3;
    width:42px; height:42px; border-radius:50%; border:1px solid rgba(255,255,255,.22);
    background:rgba(22,15,8,.5); color:#f0e6d2; font-size:1.5rem; line-height:1; cursor:pointer;
    display:flex; align-items:center; justify-content:center; padding:0 0 3px; transition:background .15s; }
  .lc-nav:hover { background:rgba(40,28,14,.78); }
  .lc-nav[hidden] { display:none; }
  .lc-prev { left:max(12px, calc(50% - 322px)); }
  .lc-next { right:max(12px, calc(50% - 322px)); }
  .lc-pos { position:absolute; top:10px; left:14px; z-index:2; font-size:.64rem; letter-spacing:.06em; color:#9a7b46; }
  .lc-pos[hidden] { display:none; }
  .lc-actions button:focus-visible, .ct-head button:focus-visible, .pv-acts button:focus-visible,
  .ct-chip:focus-visible, .keep-badge:focus-visible, .cross-btn:focus-visible,
  .kc-x:focus-visible, .kc-print:focus-visible, .loupe-x:focus-visible, .lc-demo-src summary:focus-visible,
  .lc-nav:focus-visible {
    outline:2px solid #c9a24e; outline-offset:2px; }
  .js-on .specimen:focus-visible { outline:2px solid #c9a24e; outline-offset:3px; border-radius:5px; }
  .js-on .specimen:focus { outline:none; }
  @media (prefers-reduced-motion: reduce) {
    .loupe-back, .loupe-card, .kc-back, .kc-panel, .cross-tray { animation:none !important; }
  }

  @media (max-width:560px) {
    .row { grid-template-columns:repeat(auto-fill,minmax(96px,1fr)); gap:26px 10px; }
    .case { padding:13px; }
    .glass { padding:14px 12px 20px; }
    .head { padding-top:34px; }
    .head h1 { font-size:1.2rem; }
    .keep-badge { top:10px; right:10px; font-size:.7rem; padding:4px 10px; }
    .cross-btn { right:10px; bottom:10px; font-size:.72rem; padding:6px 12px; }
    .lc-nav { display:none; }  /* モバイルはスワイプで。矢印は隠す */
  }
</style>
</head>
<body>
  <header class="head">
    <h1>ＨＴＭＬ　タグ標本箱</h1>
    <p>HTML5 のタグを一匹ずつ採集し、目(Order)ごとに並べた標本ケース。<br>
    ただ眺めて、愛でるためのもの。これまでに ${specimens.length} 種を収めました。</p>
    <p class="head-hint" hidden>標本をクリックすると<b>観察票</b>がひらきます。二匹を<b>交配</b>させると、詩の問いが立ちます。</p>
    <p class="legend">
      <span class="k-classica"><i></i>古種</span>
      <span class="k-nova"><i></i>新種 (HTML5)</span>
      <span class="k-recens"><i></i>新参種</span>
      <span class="k-relicta"><i></i>絶滅危惧種 †</span>
    </p>
  </header>

  <main class="case" id="mainCase">
    <div class="glass">
${drawers}
      <span class="grain" aria-hidden="true"></span>
    </div>
  </main>

  <footer class="foot">
    <p><i>spec. relicta †</i> は絶滅危惧種。&lt;marquee&gt; のように、廃止されてなお飛んでいる目撃例あり。<br>
    <a href="specimen/labels.html">▸ 印刷用ラベルシート</a> ／ <a href="dictionary.html">▸ 辞書として読む（めくる・一覧・検索）</a></p>
  </footer>

  <!-- 観察票（拡大鏡で標本を覗く＝辞書の中身） -->
  <div id="loupe" class="loupe" hidden>
    <div class="loupe-back" data-close></div>
    <button class="lc-nav lc-prev" type="button" aria-label="前の標本（←）" hidden>‹</button>
    <button class="lc-nav lc-next" type="button" aria-label="次の標本（→）" hidden>›</button>
    <article class="loupe-card" role="dialog" aria-modal="true" aria-labelledby="lcName">
      <button class="loupe-x" data-close title="閉じる" aria-label="閉じる">✕</button>
      <span class="lc-pos" hidden></span>
      <div class="lc-head">
        <span class="lc-name" id="lcName"></span>
        <span class="lc-tax"></span>
      </div>
      <dl class="lc-body">
        <dt>定義</dt><dd class="lc-summary"></dd>
        <dt>詩の素材として</dt><dd class="lc-poetic"></dd>
        <dt>けしかけ</dt><dd class="lc-spark"></dd>
      </dl>
      <section class="lc-demo">
        <div class="lc-demo-strip">生きた標本 — 以下は、本物のHTMLそのもの。</div>
        <div class="lc-demo-live"></div>
        <details class="lc-demo-src"><summary>HTMLのソースを見る</summary><pre class="lc-demo-code"></pre></details>
      </section>
      <div class="lc-actions">
        <button class="lc-cross">＋ 交配に加える</button>
        <button class="lc-keep">収蔵する</button>
        <button class="lc-print">ラベルを印刷</button>
      </div>
    </article>
  </div>

  <!-- 交配台（二種を掛け合わせて、まだ無い詩を想像する） -->
  <button id="crossBtn" class="cross-btn" hidden>交配台<span class="cb-n">0</span></button>
  <aside id="cross" class="cross-tray" hidden>
    <div class="ct-head">
      <span class="ct-title">交配台 <span class="ct-count">0</span></span>
      <button class="ct-seed" title="偶然の組を引く">種をまく</button>
      <button class="ct-min" title="閉じる">✕</button>
    </div>
    <div class="ct-chips"></div>
    <div class="ct-prov"></div>
  </aside>

  <button id="keepBadge" class="keep-badge" hidden>収蔵 <span class="kb-n">0</span></button>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>

  <!-- 収蔵箱（収蔵した標本だけを並べ直す） -->
  <div id="keptCase" class="kept-case" hidden>
    <div class="kc-back" data-kc-close></div>
    <div class="kc-panel" role="dialog" aria-modal="true" aria-labelledby="kcTitle">
      <div class="kc-bar">
        <span class="kc-title" id="kcTitle">私の収蔵箱</span>
        <button class="kc-print" title="収蔵したラベルをまとめて印刷">ラベルをまとめて印刷</button>
        <button class="kc-x" data-kc-close title="閉じる">✕ 閉じる</button>
      </div>
      <main class="case kc-inner">
        <div class="glass">
          <section class="drawer">
            <h2 class="order"><span class="o-la">Collectio</span><span class="o-ja">収蔵</span></h2>
            <div class="row kc-row"></div>
          </section>
          <span class="grain" aria-hidden="true"></span>
        </div>
      </main>
    </div>
  </div>

  <script>window.__DICT__=${dictJson};</script>
  <script>
  (function(){
    var D = window.__DICT__; if(!D) return;
    var byTag={}; D.specimens.forEach(function(s){ byTag[s.tag]=s; });
    function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
    function shuffled(n){ var a=[],i,j,t; for(i=0;i<n;i++)a.push(i); for(i=n-1;i>0;i--){ j=Math.floor(Math.random()*(i+1)); t=a[i];a[i]=a[j];a[j]=t; } return a; }
    function esc(x){ return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    var cross=[];
    try{ cross=JSON.parse(localStorage.getItem('htmldict.case.cross')||'[]'); }catch(e){}
    cross=cross.filter(function(t){ return byTag[t]; });
    function saveCross(){ try{ localStorage.setItem('htmldict.case.cross',JSON.stringify(cross)); }catch(e){} }
    function deco(x){ return String(x).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'); }

    // しおり（収蔵）
    var kept=new Set();
    try{ (JSON.parse(localStorage.getItem('htmldict.case.kept')||'[]')||[]).forEach(function(t){ if(byTag[t]) kept.add(t); }); }catch(e){}
    function saveKept(){ try{ localStorage.setItem('htmldict.case.kept',JSON.stringify(Array.from(kept))); }catch(e){} }

    var loupe=document.getElementById('loupe');
    var tray=document.getElementById('cross');

    // トースト
    var toastEl=document.getElementById('toast');
    function toast(msg){ toastEl.textContent=msg; toastEl.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(function(){ toastEl.classList.remove('show'); },1800); }

    function markKept(){ document.querySelectorAll('.specimen').forEach(function(f){ f.classList.toggle('is-kept', kept.has(f.getAttribute('data-tag'))); }); }
    function updateKeepBadge(){ var b=document.getElementById('keepBadge'); b.hidden=false; b.querySelector('.kb-n').textContent=kept.size; }
    function keepLabel(tag){ return kept.has(tag)?'◉ 収蔵済み（外す）':'収蔵する'; }
    function toggleKeep(tag){ if(kept.has(tag)) kept.delete(tag); else kept.add(tag); saveKept(); markKept(); updateKeepBadge(); }

    function labelCardHTML(s){
      return '<div class="pcard"><span class="sp">'+s.display+'</span>'
        +'<span class="genus"><i>'+esc(s.orderLa)+'</i> · '+esc(s.orderJa)+'</span>'
        +'<span class="loc">Hab. '+esc(s.habJa)+'</span>'
        +'<span class="det"><i>'+esc(s.statusLa)+'</i> · '+esc(s.statusJa)+(s.dagger?' †':'')+'</span>'
        +'<span class="coll">coll. ＿＿＿＿　HTML&nbsp;Day</span></div>';
    }
    var LABEL_BASE='body{margin:0;font-family:"Hiragino Mincho ProN","Yu Mincho",serif;color:#222;}'
      +'.pcard{border:1px dashed #999;border-radius:2px;text-align:center;display:flex;flex-direction:column;break-inside:avoid;}'
      +'.sp{font-family:"SFMono-Regular",Consolas,Menlo,monospace;margin-bottom:1.2mm;}'
      +'.genus{color:#333;}.loc,.det{color:#555;}.det i{color:#7a2d22;}'
      +'.coll{border-top:.3pt solid #ccc;color:#888;letter-spacing:.04em;}';
    var SINGLE_CSS='@page{margin:14mm;}'+LABEL_BASE
      +'.pcard{width:54mm;margin:10mm auto;padding:6mm 4mm;gap:1.2mm;}'
      +'.sp{font-size:13pt;}.genus{font-size:8pt;}.loc,.det{font-size:7pt;}.coll{margin-top:2.5mm;padding-top:1.2mm;font-size:6pt;}';
    var SHEET_CSS='@page{margin:12mm;}'+LABEL_BASE
      +'.sheet{display:flex;flex-wrap:wrap;gap:5mm;align-content:flex-start;}'
      +'.pcard{width:40mm;padding:4mm 3mm;gap:1mm;}'
      +'.sp{font-size:11pt;}.genus{font-size:7.5pt;}.loc,.det{font-size:6.5pt;}.coll{margin-top:2mm;padding-top:1mm;font-size:5.5pt;}';
    function printDoc(title, css, bodyHTML){
      var doc='<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><title>'+title+'</title><style>'+css+'</style></head><body>'+bodyHTML+'</body></html>';
      var ifr=document.createElement('iframe'); ifr.setAttribute('aria-hidden','true');
      ifr.style.cssText='position:fixed;width:0;height:0;border:0;right:0;bottom:0;opacity:0;';
      document.body.appendChild(ifr);
      var w=ifr.contentWindow; w.document.open(); w.document.write(doc); w.document.close();
      var fired=false; function go(){ if(fired)return; fired=true; try{ w.focus(); w.print(); }catch(e){} setTimeout(function(){ if(ifr.parentNode) ifr.parentNode.removeChild(ifr); },1200); }
      ifr.onload=go; setTimeout(go,350);
    }
    function printLabel(tag){ var s=byTag[tag]; if(!s) return; printDoc(s.tag+' label', SINGLE_CSS, labelCardHTML(s)); }
    function printKept(){
      if(!kept.size){ toast('まだ収蔵した標本がありません'); return; }
      var tags=Array.from(kept).filter(function(t){ return byTag[t]; });
      var cards=tags.map(function(t){ return labelCardHTML(byTag[t]); }).join('');
      printDoc('収蔵ラベル '+tags.length+'枚', SHEET_CSS, '<div class="sheet">'+cards+'</div>');
    }

    function buildMemo(){
      var L=['— HTML詩語辞典・交配メモ —',''];
      if(lastProv){
        L.push(lastProv.names.map(deco).join(' × '));
        L.push('そのとき——「'+lastProv.strat+'」');
        L.push('題材：〈'+lastProv.theme+'〉','');
      }
      L.push('［素材の標本］');
      cross.forEach(function(t){ var s=byTag[t]; if(!s) return;
        L.push('・'+deco(s.display)+'  '+s.summary);
        if(s.spark) L.push('   けしかけ: '+s.spark);
      });
      return L.join('\\n');
    }
    function exportMemo(){
      var text=buildMemo();
      function fb(){ var ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); var ok=false; try{ ok=document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); toast(ok?'交配メモをコピーしました':'コピーできませんでした'); }
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){ toast('交配メモをコピーしました'); }, fb); }
      else fb();
    }

    function crossLabel(tag){ return cross.indexOf(tag)>=0 ? '◉ 交配中（外す）' : '＋ 交配に加える'; }
    function reducedMotion(){ try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
    function caseList(){ return Array.prototype.map.call(document.querySelectorAll('#mainCase .specimen'), function(x){ return x.getAttribute('data-tag'); }); }
    var navList=[], navIndex=0;
    function fillLoupe(tag){
      var s=byTag[tag]; if(!s) return;
      loupe.querySelector('.lc-name').innerHTML=s.display;
      loupe.querySelector('.lc-tax').innerHTML='<i>'+esc(s.orderLa)+'</i> · '+esc(s.orderJa)+' ／ Hab. '+esc(s.habJa)+' ／ <i>'+esc(s.statusLa)+'</i> · '+esc(s.statusJa)+(s.dagger?' †':'');
      loupe.querySelector('.lc-summary').textContent=s.summary;
      loupe.querySelector('.lc-poetic').textContent=s.poetic;
      loupe.querySelector('.lc-spark').textContent=s.spark;
      loupe.querySelector('.lc-demo-live').innerHTML=s.demo;
      loupe.querySelector('.lc-demo-code').textContent=s.demo;
      var src=loupe.querySelector('.lc-demo-src'); if(src) src.open=false;
      var cb=loupe.querySelector('.lc-cross');
      cb.textContent=crossLabel(tag); cb.classList.toggle('is-on', cross.indexOf(tag)>=0);
      cb.onclick=function(){ toggleCross(tag); cb.textContent=crossLabel(tag); cb.classList.toggle('is-on', cross.indexOf(tag)>=0); };
      var kb=loupe.querySelector('.lc-keep');
      kb.textContent=keepLabel(tag); kb.classList.toggle('is-on', kept.has(tag));
      kb.onclick=function(){ toggleKeep(tag); kb.textContent=keepLabel(tag); kb.classList.toggle('is-on', kept.has(tag)); };
      loupe.querySelector('.lc-print').onclick=function(){ printLabel(tag); };
      var pos=loupe.querySelector('.lc-pos');
      if(navList.length>1){ pos.textContent=(navIndex+1)+' / '+navList.length; pos.hidden=false; } else pos.hidden=true;
      var card=loupe.querySelector('.loupe-card'); if(card) card.scrollTop=0;
    }
    var _lastFocus=null;
    function focusables(root){ return Array.prototype.filter.call(root.querySelectorAll('a[href],button:not([disabled]),summary,[tabindex]:not([tabindex="-1"]),input,select,textarea'), function(el){ return !el.hidden && el.offsetParent!==null; }); }
    function trapTab(e, root){ var f=focusables(root); if(!f.length) return; var first=f[0], last=f[f.length-1]; if(e.shiftKey){ if(document.activeElement===first){ e.preventDefault(); last.focus(); } } else if(document.activeElement===last){ e.preventDefault(); first.focus(); } }
    function openLoupe(tag, list){
      navList=(list&&list.length)?list:caseList();
      navIndex=navList.indexOf(tag); if(navIndex<0){ navList=[tag]; navIndex=0; }
      loupe.querySelector('.loupe-card').style.animation='';
      fillLoupe(tag);
      var multi=navList.length>1;
      loupe.querySelector('.lc-prev').hidden=!multi; loupe.querySelector('.lc-next').hidden=!multi;
      _lastFocus=document.activeElement;
      loupe.hidden=false; document.body.classList.add('loupe-open');
      var x=loupe.querySelector('.loupe-x'); if(x) x.focus();
    }
    function navTo(d){
      if(navList.length<2) return;
      navIndex=(navIndex+d+navList.length)%navList.length;
      fillLoupe(navList[navIndex]);
      if(!reducedMotion()){ var card=loupe.querySelector('.loupe-card'); card.style.animation='none'; void card.offsetWidth; card.style.animation=(d>0?'slide-next':'slide-prev')+' .18s ease'; }
    }
    loupe.querySelector('.lc-prev').onclick=function(){ navTo(-1); };
    loupe.querySelector('.lc-next').onclick=function(){ navTo(1); };
    var _tx=0,_ty=0,_track=false;
    loupe.addEventListener('touchstart', function(e){ if(e.touches.length!==1){ _track=false; return; } _tx=e.touches[0].clientX; _ty=e.touches[0].clientY; _track=true; }, {passive:true});
    loupe.addEventListener('touchend', function(e){ if(!_track) return; _track=false; var t=e.changedTouches[0]; var dx=t.clientX-_tx, dy=t.clientY-_ty; if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.5) navTo(dx<0?1:-1); }, {passive:true});
    function closeLoupe(){ loupe.hidden=true; if(document.getElementById('keptCase').hidden) document.body.classList.remove('loupe-open'); if(_lastFocus&&_lastFocus.focus){ try{ _lastFocus.focus(); }catch(e){} } }
    loupe.addEventListener('click', function(e){ if(e.target.hasAttribute('data-close')) closeLoupe(); });
    document.addEventListener('keydown', function(e){
      if(!loupe.hidden){
        if(e.key==='Escape') closeLoupe();
        else if(e.key==='ArrowLeft') navTo(-1);
        else if(e.key==='ArrowRight') navTo(1);
        else if(e.key==='Tab') trapTab(e, document.getElementById('loupe'));
        return;
      }
      if(!document.getElementById('keptCase').hidden){
        if(e.key==='Escape') closeKeptCase();
        else if(e.key==='Tab') trapTab(e, document.getElementById('keptCase'));
        return;
      }
      if(e.key==='Enter' || e.key===' ' || e.key==='Spacebar'){
        var ae=document.activeElement, f=(ae&&ae.closest)?ae.closest('.specimen'):null;
        if(f){ e.preventDefault(); openFromEl(f); }
      }
    });

    // 本体の標本も収蔵箱の複製も、クリック／Enter・Space で観察票を開く。
    // めくりの範囲は「開いた文脈」に合わせる（収蔵箱からは収蔵分、本体からは全体）。
    function openFromEl(f){
      var listEls=f.closest('#keptCase') ? document.querySelectorAll('#keptCase .kc-row .specimen') : document.querySelectorAll('#mainCase .specimen');
      var list=Array.prototype.map.call(listEls, function(x){ return x.getAttribute('data-tag'); });
      openLoupe(f.getAttribute('data-tag'), list);
    }
    document.addEventListener('click', function(e){
      if(e.target.closest('.cross-tray')||e.target.closest('.loupe')||e.target.closest('.kc-bar')) return;
      var f=e.target.closest('.specimen'); if(f) openFromEl(f);
    });

    var lastProv=null;
    function provFor(tags){
      return { key:tags.join(','), names:tags.map(function(t){ var s=byTag[t]; return s?s.display:esc(t); }), strat:pick(D.strategies), theme:pick(D.themes) };
    }
    function provHTML(p){
      return '<div class="pv"><span class="pv-label">組み合わせの問い</span>'+
        '<p class="pv-text"><b>'+p.names.join('</b> と <b>')+'</b> を、ひとつの作品の中で出会わせる。<br>'+
        'そのとき——「'+esc(p.strat)+'」<br>題材は、たとえば〈'+esc(p.theme)+'〉。</p></div>';
    }
    function openTray(){ document.getElementById('cross').hidden=false; document.getElementById('crossBtn').hidden=true; }
    function closeTray(){ document.getElementById('cross').hidden=true; document.getElementById('crossBtn').hidden=false; }
    function toggleCross(tag){ var i=cross.indexOf(tag); if(i>=0)cross.splice(i,1); else cross.push(tag); saveCross(); openTray(); renderTray(); }
    function renderTray(){
      tray.querySelector('.ct-count').textContent=cross.length;
      var cbn=document.getElementById('crossBtn'); cbn.querySelector('.cb-n').textContent=cross.length; cbn.classList.toggle('has', cross.length>0);
      var chips=tray.querySelector('.ct-chips'); chips.innerHTML='';
      if(!cross.length){
        var em=document.createElement('span'); em.className='ct-empty';
        em.innerHTML='標本をクリック→「交配に加える」で、ここに集まります。<br>二匹そろうと、詩の問いが立ちます。「種をまく」で偶然に引くことも。';
        chips.appendChild(em);
      }
      cross.forEach(function(t){
        var s=byTag[t];
        var c=document.createElement('span'); c.className='ct-chip';
        c.innerHTML=(s?s.display:esc(t))+' <button class="ct-rm" title="外す">✕</button>';
        c.addEventListener('click', function(ev){ if(ev.target.classList.contains('ct-rm')){ toggleCross(t); } else { openLoupe(t); } });
        chips.appendChild(c);
      });
      var prov=tray.querySelector('.ct-prov');
      if(cross.length>=2){
        if(!lastProv || lastProv.key!==cross.join(',')) lastProv=provFor(cross);
        prov.innerHTML=provHTML(lastProv)+'<div class="pv-acts"><button class="pv-redraw">引き直す</button><button class="pv-memo">メモへ書き出す</button><button class="pv-clear">空にする</button></div>';
        prov.querySelector('.pv-redraw').onclick=function(){ lastProv=provFor(cross); renderTray(); };
        prov.querySelector('.pv-memo').onclick=exportMemo;
        prov.querySelector('.pv-clear').onclick=function(){ cross=[]; saveCross(); lastProv=null; renderTray(); };
      } else { prov.innerHTML=''; }
    }
    function sowSeed(){
      var n=2+Math.floor(Math.random()*2);
      cross=shuffled(D.specimens.length).slice(0,n).map(function(i){ return D.specimens[i].tag; });
      saveCross(); lastProv=provFor(cross); openTray(); renderTray();
    }
    document.getElementById('crossBtn').onclick=openTray;
    tray.querySelector('.ct-seed').onclick=sowSeed;
    tray.querySelector('.ct-min').onclick=closeTray;

    // 収蔵箱: 収蔵した標本だけを別の箱に並べ直して表示
    var keptCase=document.getElementById('keptCase');
    var _lastFocusKC=null;
    function openKeptCase(){
      if(!kept.size){ toast('まだ収蔵した標本がありません'); return; }
      var row=keptCase.querySelector('.kc-row'); row.innerHTML='';
      document.querySelectorAll('#mainCase .specimen').forEach(function(f){
        if(kept.has(f.getAttribute('data-tag'))) row.appendChild(f.cloneNode(true));
      });
      keptCase.querySelector('.kc-title').textContent='私の収蔵箱 — '+kept.size+' 標本';
      _lastFocusKC=document.activeElement;
      keptCase.hidden=false; document.body.classList.add('loupe-open');
      var x=keptCase.querySelector('.kc-x'); if(x) x.focus();
    }
    function closeKeptCase(){ keptCase.hidden=true; if(loupe.hidden) document.body.classList.remove('loupe-open'); if(_lastFocusKC&&_lastFocusKC.focus){ try{ _lastFocusKC.focus(); }catch(e){} } }
    keptCase.addEventListener('click', function(e){ if(e.target.hasAttribute('data-kc-close')) closeKeptCase(); });
    keptCase.querySelector('.kc-print').onclick=printKept;
    document.getElementById('keepBadge').onclick=openKeptCase;

    var hint=document.querySelector('.head-hint'); if(hint) hint.hidden=false;
    document.body.classList.add('js-on');
    document.getElementById('crossBtn').hidden=false;
    markKept(); updateKeepBadge(); renderTray();
  })();
  </script>
</body>
</html>
`;
}

// ── 旧URL（specimen/case.html）からの後方互換リダイレクト ─
function buildRedirect() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=../index.html">
<link rel="canonical" href="../index.html">
<title>標本箱は表紙へ移動しました</title>
</head>
<body style="margin:0;padding:48px 20px;text-align:center;background:#160f08;color:#eae3d5;font-family:'Hiragino Mincho ProN','Yu Mincho',serif;">
  <p>「タグ標本箱」はサイトの表紙に移動しました。</p>
  <p><a href="../index.html" style="color:#d9b48a;">▸ 表紙へ進む</a></p>
</body>
</html>
`;
}

// ── 出力 ─────────────────────────────────────────────
fs.writeFileSync(path.join(root, "index.html"), buildCase());          // 表紙＝標本箱
fs.writeFileSync(path.join(__dirname, "labels.html"), buildLabels());
fs.writeFileSync(path.join(__dirname, "case.html"), buildRedirect());  // 旧URL→/index.html
console.log("生成完了: index.html（表紙＝標本箱）, specimen/labels.html, specimen/case.html（→/index.html）");
