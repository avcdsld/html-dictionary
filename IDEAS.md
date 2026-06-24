# アイデア帳 — HTML Day に向けて

このプロジェクトから派生した、つくりたいもの・やりたいことのメモ。
コードで書いてもいいし、物理的につくってもいい。

---

## タグ標本箱（実装済み → `specimen/`）

> タグの文字列を小さい紙に印刷して、昆虫標本のように箱の中に並べたら素敵だと思った。
> タグそのものを眺めて愛でたい。

**着想の核：HTMLタグ＝分類学的に採集された昆虫**

本物の昆虫標本ラベルの様式（学名・分類・採集地・採集日・採集者）を、HTMLタグに移す。

| 標本ラベル | HTMLタグだと |
|---|---|
| 学名 *(genus species)* | タグそのもの（`<details>` など） |
| 目・科 (Order) | category のラテン名（構造目 *Structuralia*、対話目 *Interactiva*…） |
| 生息地 (Hab.) | そのタグが棲む場所（*caput*=head、*tabula*=table、*corpus*=body…） |
| 記載 (det.) | 古種 / 新種(HTML5) / 新参種 / 絶滅危惧種 |
| 採集者 (coll.) | あなた（HTML Day の参加者） |

`<marquee>` は「絶滅危惧種・今も飛んでいる目撃例あり †」、`<blink>` は「絶滅種」、
`<dialog>` は「近年記載された新種」——という見立て。

**成果物（`data.js` から `specimen/build.js` で自動生成）**
- `specimen/case.html` … 画面で眺めるデジタル標本ケース（木箱＋ピン留め、HTML+CSSのみ・JS不要）
- `specimen/labels.html` … 印刷用ラベルシート（A4・切ってピン留め→物理標本箱）

再生成: `node specimen/build.js`

---

## まだ作っていない種（次の採集候補）

廃止・歴史的タグの「**廃墟標本／化石種**」セクション。
`blink`（絶滅種）, `center`, `big`, `strike`, `tt`, `font`, `nobr`, `acronym`, `applet`,
`frame` / `frameset`, `marquee`(収蔵済) など。古いHTMLならではの味があり、
純HTML作品の素材としても面白い。標本箱に「化石区画」を増設するイメージ。
