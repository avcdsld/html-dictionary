// data.js — HTML5 のタグと機能の「辞書」データ
//
// 一つひとつが、詩の素材としての HTML 要素。
// summary: ひとことの定義
// poetic : 詩の素材として、何が面白いか
// spark  : この要素から詩を芽吹かせるための、けしかけ
// demo   : 実際にブラウザで描画される、生きた標本（純HTML）
// note   : 技術的な補足（任意）
//
// 「作品」は素のHTMLだけで作る。だから demo もすべて、CSSもJSも使わない素のHTML。

const CATEGORIES = {
  structure: "構造",
  text: "テキスト",
  inline: "語句",
  list: "リスト・定義",
  table: "表",
  form: "フォーム・入力",
  embed: "埋め込み・メディア",
  interactive: "対話",
  meta: "メタ・隠れたもの",
  char: "文字・記号",
  attr: "属性の力",
};

const ELEMENTS = [
  // ── 構造 ───────────────────────────────────────────────
  {
    tag: "html", display: "<html>", category: "structure",
    summary: "文書ぜんたいを抱える、いちばん外側の器。",
    poetic: "すべての詩がこの中で起きる。lang 属性ひとつで、文書に『母語』を与えられる。lang=\"ja\" と書くだけで、この紙は日本語で考えはじめる。",
    spark: "lang を、ありえない言語コードにしてみる。あるいは、嘘の母語を宣言してみる。",
    demo: `<p lang="ja">この文書は、何語で夢を見るのだろう。</p>`,
    note: "<html lang=\"…\"> は読み上げや約物の扱いに影響する。"
  },
  {
    tag: "title", display: "<title>", category: "meta",
    summary: "ブラウザのタブやブックマークに出る、文書の名前。",
    poetic: "本文の外側にある、もう一つのキャンバス。読者はまずタブで詩を読む。ページを開く前から、詩は始まっている。",
    spark: "タイトルだけで完結する一行詩。本文は真っ白のまま、タブの中だけで物語を終わらせる。",
    demo: `<!-- このページの &lt;title&gt; を見上げてごらん。タブに詩が住んでいる。 -->\n<p>本文より先に、タブを読む人がいる。</p>`,
  },
  {
    tag: "header / footer", display: "<header> <footer>", category: "structure",
    summary: "冒頭と末尾。導入と署名のための、意味の枠。",
    poetic: "始まりと終わり。header は息を吸う場所、footer は息を吐く場所。中身がなくても、その『位置』だけで時間が流れる。",
    spark: "header と footer に同じ一行を置く。詩は円環になり、終わりが始まりに戻る。",
    demo: `<header><p>はじめに、沈黙があった。</p></header>\n<footer><p>はじめに、沈黙があった。</p></footer>`,
  },
  {
    tag: "main", display: "<main>", category: "structure",
    summary: "文書のいちばん大事な、中心の内容。",
    poetic: "『ここが主役だ』と宣言する要素。一文書にひとつだけ。何を main にするかは、何を詩の中心にするかと同じ問い。",
    spark: "あえて、空白や余白を <main> で囲ってみる。中心に『無』を据える。",
    demo: `<main><p>　</p></main>\n<aside><p>（すべては、この余白の周りで起きている）</p></aside>`,
  },
  {
    tag: "section / article", display: "<section> <article>", category: "structure",
    summary: "意味のまとまり。article は単独で完結する一片。",
    poetic: "連や段落より大きな、意味の部屋。article は切り取って持ち運べる一篇。section は、章。",
    spark: "同じ article を繰り返し並べる。少しずつ言葉を変えながら、変奏曲のように。",
    demo: `<article><p>朝。窓を開ける。</p></article>\n<article><p>朝。窓を、まだ開けない。</p></article>`,
  },
  {
    tag: "aside", display: "<aside>", category: "structure",
    summary: "本筋から少し外れた、傍らの内容（余談・補足・脇の声）。",
    poetic: "本文のかたわらにある、もうひとつの声。脚注、余白の書き込み、心の傍白。主役ではないからこそ言える本音を、そっと脇に置ける。",
    spark: "main に建前を、aside に本音を流す。読者は、どちらを「本当」と取るだろう。",
    demo: `<p>きょうは、よく晴れていました。</p>\n<aside><p>（本当は、一日じゅう雨が降ればいいと思っていた）</p></aside>`,
  },
  {
    tag: "nav", display: "<nav>", category: "structure",
    summary: "他の場所への道しるべ（リンクの集まり）。",
    poetic: "『行き先』そのものを意味として扱える。リンク先のないナビゲーション、どこにも行けない案内板は、それ自体が詩になる。",
    spark: "実在しない場所への目次を作る。『#忘れた約束』『#まだない明日』へのリンク。",
    demo: `<nav>\n  <a href="#kinou">きのう</a> ／\n  <a href="#asu">あす</a> ／\n  <a href="#nai">どこでもない場所</a>\n</nav>`,
  },
  {
    tag: "h1–h6", display: "<h1> … <h6>", category: "structure",
    summary: "見出し。h1 がいちばん大きく、h6 がいちばん小さい。",
    poetic: "声の大きさの階段。同じ言葉を h1 から h6 へ降りていくと、叫びが囁きへと細っていく。文字の大きさで、距離や時間を描ける。",
    spark: "ひとつの言葉を h1→h6 と並べる。遠ざかる足音、消えていく名前。",
    demo: `<h1>わすれない</h1>\n<h2>わすれない</h2>\n<h3>わすれない</h3>\n<h4>わすれない</h4>\n<h5>わすれない</h5>\n<h6>わすれ…</h6>`,
  },
  {
    tag: "hgroup", display: "<hgroup>", category: "structure",
    summary: "見出しと、その副題をひとまとめにする。",
    poetic: "題と、副題。大きな声と、それに寄り添う小さな声。表題詩の構造そのもの。",
    spark: "副題で、表題を裏切る。『春／ただし、誰もいない』。",
    demo: `<hgroup>\n  <h1>春</h1>\n  <p>ただし、誰もいない</p>\n</hgroup>`,
  },
  {
    tag: "address", display: "<address>", category: "structure",
    summary: "連絡先や差出人を示す。",
    poetic: "『誰から』を刻む要素。手紙の、宛名のない差出人欄。届かない手紙の住所を書ける。",
    spark: "宛先も連絡先も書かず、<address> の中に感情だけを置く。",
    demo: `<address>\n  さみしさ より<br>\n  返信は、いりません\n</address>`,
  },
  {
    tag: "div / span", display: "<div> <span>", category: "structure",
    summary: "意味を持たない、ただの容れもの（ブロックとインライン）。",
    poetic: "何の意味も持たないことが、逆に自由。名前のない器。CSSなしでは見た目も変わらない——だからこそ、純粋な『区切り』としてだけ存在する。",
    spark: "意味のないものに意味のある名前を付ける。<div title=\"心臓\"> の中に、何も入れない。",
    demo: `<span>言葉と</span><span>言葉のあいだに</span><span>、見えない継ぎ目がある。</span>`,
  },

  // ── テキスト ───────────────────────────────────────────
  {
    tag: "p", display: "<p>", category: "text",
    summary: "段落。文章のいちばん基本的なまとまり。",
    poetic: "もっとも素朴な、もっとも強い器。一行を <p> で囲むだけで、それは『ひとまとまりの息』になる。詩のいちばんの友。",
    spark: "空の <p></p> をいくつも並べる。沈黙の段落、語られなかった連。",
    demo: `<p>ここに、ひとつの息がある。</p>\n<p></p>\n<p></p>\n<p>ここに、もうひとつ。</p>`,
  },
  {
    tag: "br / wbr", display: "<br> <wbr>", category: "text",
    summary: "br は強制改行。wbr は『折り返してよい』という見えない印。",
    poetic: "br は息継ぎ、行分け、断ち切り。詩でいちばん使う一打。wbr は目に見えない——画面が狭いときだけ、そこで折れる。誰も気づかない関節。",
    spark: "ひとつの長い単語の中に <wbr> を仕込む。読者の画面の幅しだいで、言葉が割れる場所が変わる。",
    demo: `<p>さよ<wbr>うな<wbr>らを、ど<wbr>こで折る?</p>\n<p>夜が<br>明けない<br>うちに</p>`,
  },
  {
    tag: "hr", display: "<hr>", category: "text",
    summary: "意味の切れ目を示す、横の罫線。",
    poetic: "場面の転換。間（ま）。一本の線が、前と後を別の時間にする。詩でいう『一字下げ』や、連と連のあいだの白。",
    spark: "本文をほとんど書かず、<hr> だけを何本も。線の間隔だけで呼吸を描く。",
    demo: `<p>会った。</p>\n<hr>\n<p>別れた。</p>\n<hr>\n<hr>\n<p>思い出した。</p>`,
  },
  {
    tag: "marquee", display: "<marquee>", category: "text",
    summary: "中の文字を、ひとりでに流れさせる（公式には廃止された、けれど今も動く古い要素）。",
    poetic: "純HTMLだけで「動き」を生む、数少ない魔法。CSSもJSも無しに、文字が勝手に流れ、往復し、立ちのぼる。仕様上は廃止されたのに、多くのブラウザでまだ生きている——亡霊のように動きつづける言葉。behavior=\"alternate\" で往復、direction=\"up\" で上昇。",
    spark: "一行を、ゆっくり永遠に流しつづける。あるいは behavior=\"alternate\" で行ったり来たり——決められない心のように。",
    demo: `<marquee>　この言葉は、止まることを知りません。どこへ行くのかも、知らないまま。　</marquee>\n<marquee behavior="alternate">行こうか、戻ろうか。</marquee>`,
    note: "公式には廃止(deprecated)。だが主要ブラウザで今も動作し、CSS/JSなしに動きを得られる、古くて貴重な手段。"
  },
  {
    tag: "pre", display: "<pre>", category: "text",
    summary: "書いたとおりの空白と改行を、そのまま保つ。",
    poetic: "唯一、空白が空白のまま生き残る場所。スペースも改行も握りつぶされない。文字で絵を描く『具体詩』『アスキーアート』の聖域。",
    spark: "言葉を、空白で配置して図形にする。雨を降らせる、川を流す、星を散らす。",
    demo: `<pre>\n   あ\n  あ あ\n あ   あ\nあ     あ\n   雨\n</pre>`,
  },
  {
    tag: "blockquote / q", display: "<blockquote> <q>", category: "text",
    summary: "引用。blockquote はブロック、q は文中の短い引用。",
    poetic: "『これは私の言葉ではない』と告げる枠。誰の声か。出典を cite に書ける——その出典を、偽ることもできる。q は約物（引用符）を自動でつけてくれる。",
    spark: "自分の言葉を <blockquote> で囲い、出典を『未来の私』にする。声を、他人にする。",
    demo: `<blockquote cite="まだ書かれていない手紙">\n  <p>あのとき、もっと言葉を惜しまなければよかった。</p>\n</blockquote>\n<p>母はいつも <q>だいじょうぶ</q> と言った。</p>`,
  },
  {
    tag: "cite", display: "<cite>", category: "inline",
    summary: "作品の題名や、出典の名を示す。",
    poetic: "『出どころ』に名を与える要素。実在しない本、歌わなかった歌の題名を、堂々と引用元にできる。",
    spark: "存在しない作品から引用する。<cite>未完の交響曲第十番</cite> より。",
    demo: `<p>それは <cite>夜の図書館・閉架の部</cite> に書いてあった。</p>`,
  },
  {
    tag: "figure / figcaption", display: "<figure> <figcaption>", category: "text",
    summary: "図版と、その説明文をひとまとめにする。",
    poetic: "『これには、こういう題がついている』という枠。中身は画像でなくてもいい。一行のテキストに、キャプションという名の声を添えられる。",
    spark: "本文を figure に、注釈を figcaption に。詩のほうを『図版』として展示する。",
    demo: `<figure>\n  <p>　　　水たまりに、空がひとつ落ちていた。</p>\n  <figcaption>図1. 拾えなかったもの</figcaption>\n</figure>`,
  },

  // ── 語句 inline ───────────────────────────────────────
  {
    tag: "a", display: "<a>", category: "inline",
    summary: "リンク。別の場所や文書、ページ内の一点へ繋ぐ。",
    poetic: "詩で唯一、読者を『連れて行ける』要素。href=\"#…\" でページ内の一語へ飛ばせる。href=\"\" で自分自身へ。リンク先が空なら、どこへも行けない。その行き止まりすら詩になる。",
    spark: "ある言葉から、遠く離れた同じ言葉へリンクを張る。詩の中に、隠された対応をつくる。",
    demo: `<p><a href="#kotae">問い</a>は、ここにある。</p>\n<p>……</p>\n<p id="kotae">そして<a href="#">答え</a>は、たぶんここではない。</p>`,
    note: "id を振った要素へ href=\"#その id\" で飛べる。これだけで純HTMLの『仕掛け』になる。"
  },
  {
    tag: "em / strong", display: "<em> <strong>", category: "inline",
    summary: "em は強調（声の抑揚）、strong は重要性。",
    poetic: "声の起伏。em は『そこを読むときの息のかかり方』。同じ文でも、どの語を em にするかで意味がまるごと変わる。",
    spark: "一文の中で em の位置を一語ずつずらした複数版を並べ、意味の変化を見せる。",
    demo: `<p><em>私</em>は行かない。</p>\n<p>私は<em>行か</em>ない。</p>\n<p>私は行か<em>ない</em>。</p>`,
  },
  {
    tag: "mark", display: "<mark>", category: "inline",
    summary: "蛍光ペンのように、注目すべき箇所を目立たせる。",
    poetic: "テキストの上に引かれた、消えない線。何を『重要』として光らせるか。マーカーの黄色は、記憶の色にも、警告の色にもなる。",
    spark: "本文の中の、たった一文字だけを mark する。読者の目が、まずそこへ落ちるように。",
    demo: `<p>たくさんの言葉の中で、わたしはただ <mark>あなた</mark> だけを覚えている。</p>`,
  },
  {
    tag: "s / del / ins", display: "<s> <del> <ins>", category: "inline",
    summary: "s は『もう正しくない』、del は削除、ins は挿入を示す。",
    poetic: "取り消し線は、消したのに残っている言葉。del と ins を並べれば、推敲の過程そのものを作品にできる。書き直しの痕、ためらいの記録。",
    spark: "本心を <del> で消し、建前を <ins> で足す。消したほうがよく読めてしまう。",
    demo: `<p>きみが <del>すきだ</del><ins>きらいだ</ins>。</p>\n<p>もう <s>会えない</s>。</p>`,
  },
  {
    tag: "small", display: "<small>", category: "inline",
    summary: "細目（こまかい注記）。免責や但し書きを表す。",
    poetic: "小さな声。ためらいながら付け足す本音。契約書の隅に書かれた、いちばん大事な一文のような囁き。",
    spark: "堂々とした宣言のあとに、<small> で取り消すような但し書きを添える。",
    demo: `<p>きみを永遠に愛する。</p>\n<p><small>※ 個人の感想です。予告なく変更される場合があります。</small></p>`,
  },
  {
    tag: "abbr", display: "<abbr>", category: "inline",
    summary: "略語。title 属性で正式名称を隠し持てる。",
    poetic: "表に出ている言葉と、その下に隠した本当の意味。title にカーソルを乗せた者だけが、隠された語に出会える。二重底の言葉。",
    spark: "ありふれた略語に、嘘の正式名称を与える。<abbr title=\"二度と戻らない瞬間\">今</abbr>。",
    demo: `<p>わたしたちは <abbr title="また会えると信じていた頃">あのとき</abbr> 笑っていた。</p>`,
    note: "title の中身は、マウスを乗せるとツールチップで現れる(純HTMLの隠し機能)。"
  },
  {
    tag: "dfn", display: "<dfn>", category: "inline",
    summary: "その語が、ここで初めて定義されることを示す。",
    poetic: "『この言葉を、私はこう決める』という宣言。辞書を自分で書き換える権利。詩の中で、ある言葉に勝手な定義を与えられる。",
    spark: "ありふれた言葉を <dfn> で囲い、独自の定義を続ける。『<dfn>夜</dfn>とは、…』",
    demo: `<p><dfn>さみしさ</dfn>とは、だれかが居たことの、形のことだ。</p>`,
  },
  {
    tag: "code / kbd / samp / var", display: "<code> <kbd> <samp> <var>", category: "inline",
    summary: "プログラムの語句・キー入力・出力・変数を表す等幅の語。",
    poetic: "機械の言葉づかい。等幅フォントの硬質な質感。kbd は『押すべきキー』——詩の中に、読者への命令を埋め込める。var は名前のない量、x や y の孤独。",
    spark: "感情を変数として書く。<var>かなしみ</var> = <var>あなた</var> × 時間。",
    demo: `<p><var>こころ</var> を <kbd>Esc</kbd> で閉じる。</p>\n<p>出力: <samp>応答なし</samp></p>`,
  },
  {
    tag: "sub / sup", display: "<sub> <sup>", category: "inline",
    summary: "sub は下付き、sup は上付きの小さな文字。",
    poetic: "文字が、行から少しだけ沈む／浮く。脚注の番号、化学式、累乗。本文の高さから外れた、ためらいの位置。注釈という名の、もう一つの声。",
    spark: "ひとつの文の中で、本音だけを sub で沈める。地の文より少し低いところで呟かせる。",
    demo: `<p>だいじょうぶ<sub>じゃない</sub>。</p>\n<p>愛<sup>※</sup> は、いつも注釈つきだ。</p>`,
  },
  {
    tag: "time", display: "<time>", category: "inline",
    summary: "日付や時刻を、機械にも読める形で刻む。",
    poetic: "時間に、正確な座標を与える要素。datetime に刻まれた時刻と、表に見える言葉が、食い違ってもいい。『永遠』と表示して、datetime には一秒だけを刻む。",
    spark: "見えるテキストと datetime をわざとずらす。表は『むかしむかし』、中身は今日の日付。",
    demo: `<p><time datetime="0001-01-01">むかしむかし</time>、あるところに。</p>\n<p>会えるのは <time datetime="9999-12-31">いつか</time>。</p>`,
  },
  {
    tag: "data", display: "<data>", category: "inline",
    summary: "見える言葉の裏に、機械向けの値を隠し持つ。",
    poetic: "表の言葉と、裏の数値。<data value=\"…\"> は、見えない本心を一語ごとに仕込める。表向きは詩、裏側には冷たいコード。",
    spark: "やさしい言葉ごとに、value で冷たい数値を割り当てる。値の総和に、別の意味を持たせる。",
    demo: `<p>きみへの気持ちは <data value="0">ことば</data> にならない。</p>`,
  },
  {
    tag: "ruby / rt / rp", display: "<ruby> <rt> <rp>", category: "inline",
    summary: "ふりがな（ルビ)。文字の上（横）に、小さな読みを振る。",
    poetic: "ひとつの言葉に、ふたつの声を同時に響かせる究極の装置。漢字の上に、本来とは違う読みを振れる。『本気』と書いて『マジ』、『運命』と書いて『さだめ』。表記と読みの二重奏。",
    spark: "漢字に、辞書にない読みを振る。表の意味と裏の音を、わざとぶつける。",
    demo: `<ruby>永遠<rp>(</rp><rt>いっしゅん</rt><rp>)</rp></ruby> を、きみと過ごした。`,
  },
  {
    tag: "bdo", display: "<bdo>", category: "inline",
    summary: "文字の流れる向きを、強制的に反転させる。",
    poetic: "右から左へ。文字を、鏡の中へ送る要素。読めそうで読めない、裏返しの言葉。dir=\"rtl\" は、時間や記憶を逆回しにする装置にもなる。",
    spark: "本文を bdo で反転させ、ところどころ正立した語を混ぜる。逆さの世界に、一つだけ正しい言葉。",
    demo: `<p><bdo dir="rtl">これは、鏡のなかから書いています。</bdo></p>`,
  },
  {
    tag: "bdi", display: "<bdi>", category: "inline",
    summary: "向きの異なる文字を、周りから隔離する。",
    poetic: "他と混ざりたくない一語のための、結界。アラビア語やヘブライ語、絵文字、記号——向きの違うものを、孤立させて守る。",
    spark: "日本語の流れの中に、逆向きの言語の断片を bdi で置く。異物として、そっと光らせる。",
    demo: `<p>名前は <bdi>‮ولاء‬</bdi>、意味は『忠誠』だと言った。</p>`,
  },
  {
    tag: "u / i / b", display: "<u> <i> <b>", category: "inline",
    summary: "下線・斜体（声色の違い）・太字。意味より見た目寄りの装飾。",
    poetic: "もっとも素朴な強さ。i は『ここだけ声色が違う』囁き、独白、心の声。u は固有名や誤りの下線。意味より先に、まず目に届く印。",
    spark: "地の文を b、心の声を i にする。二つの声を、ひとつの段落で同時に流す。",
    demo: `<p><b>行ってきます</b>、と言った。<i>（もう帰らないつもりで）</i></p>`,
  },

  // ── リスト・定義 ───────────────────────────────────────
  {
    tag: "ul / li", display: "<ul> <li>", category: "list",
    summary: "順序のない箇条書き。点（・）で並ぶ項目。",
    poetic: "順番のないものたち。買い物のメモ、心残りのリスト、忘れ物の一覧。並列であること自体が、ひとつの平等な眼差し。",
    spark: "『持っていけなかったもの』『言えなかったこと』を、ただ淡々と箇条書きにする。",
    demo: `<ul>\n  <li>かさ</li>\n  <li>さようなら</li>\n  <li>もう一杯のコーヒー</li>\n</ul>`,
  },
  {
    tag: "ol", display: "<ol>", category: "list",
    summary: "順序のある番号つきリスト。reversed で逆順、start で開始番号を指定。",
    poetic: "順番が意味を持つ列。手順書、カウントダウン。reversed を付ければ 3, 2, 1 と減っていく——終わりに向かう時間を、番号で刻める。start や value で番号を飛ばし、欠落を演出できる。",
    spark: "reversed のリストで、ロケットでも別れでもないカウントダウンを書く。0 のあとに、何を置く?",
    demo: `<ol reversed>\n  <li>もう少しで、夏が終わる</li>\n  <li>もう少しで、声を忘れる</li>\n  <li>もう少しで</li>\n</ol>`,
  },
  {
    tag: "dl / dt / dd", display: "<dl> <dt> <dd>", category: "list",
    summary: "定義リスト。dt（語）と dd（その説明）の組。",
    poetic: "自分だけの辞書を作る器。dt に言葉、dd にあなたの定義。ひとつの dt に複数の dd を付け、一語に幾通りもの意味を持たせられる。",
    spark: "ありふれた言葉ばかりを並べ、すべてに私的な定義を与える。世界を、もう一度名づけ直す。",
    demo: `<dl>\n  <dt>夜</dt>\n  <dd>昼に言えなかったことの、置き場所。</dd>\n  <dt>あなた</dt>\n  <dd>まだ、うまく定義できない。</dd>\n  <dd>たぶん、一生かかる。</dd>\n</dl>`,
  },
  {
    tag: "menu", display: "<menu>", category: "list",
    summary: "操作の選択肢を並べる、もうひとつのリスト。",
    poetic: "『選べる』ことを示すリスト。差し出された選択肢——どれも選べない選択肢、選んでも何も起きない選択肢を並べられる。",
    spark: "人生の岐路をメニューにする。どの項目もリンク先がなく、ただ選択肢としてだけ存在する。",
    demo: `<menu>\n  <li>進む</li>\n  <li>戻る</li>\n  <li>ここに留まる</li>\n</menu>`,
  },

  // ── 表 table ──────────────────────────────────────────
  {
    tag: "table", display: "<table>", category: "table",
    summary: "行と列のます目。tr（行）, td（升）, th（見出し）で組む。",
    poetic: "格子。碁盤の目に言葉を置く、視覚詩の道具。空のセルは沈黙、横長に結合したセルは引き伸ばされた時間。表は『関係』を空間で描く。",
    spark: "升目の対角線だけに文字を置き、あとは空白に。表で図形詩を組む。",
    demo: `<table border="1">\n  <tr><td>朝</td><td></td><td></td></tr>\n  <tr><td></td><td>昼</td><td></td></tr>\n  <tr><td></td><td></td><td>夜</td></tr>\n</table>`,
    note: "colspan / rowspan でセルを結合できる。空セルは空白として効く。"
  },
  {
    tag: "caption", display: "<caption>", category: "table",
    summary: "表につけるタイトル。表の上（または下）に置かれる。",
    poetic: "格子に与える題。データの一覧に、詩的な見出しを冠することで、ただの表が作品の様相を帯びる。",
    spark: "感情の数値表に、<caption> で文学的な題をつける。『失われた時間の収支報告』。",
    demo: `<table border="1">\n  <caption>会わなかった日の数</caption>\n  <tr><td>今年</td><td>365</td></tr>\n</table>`,
  },
  {
    tag: "tr / td / th", display: "<tr> <td> <th>", category: "table",
    summary: "表の、行（tr）・データの升（td）・見出しの升（th）。",
    poetic: "格子をかたちづくる、最小の部屋。td は名もなき升、th は列や行を束ねる見出しの声。空の td は沈黙、colspan/rowspan で引き延ばされた升は、伸びていく時間になる。",
    spark: "見出し（th）だけが並び、中身（td）はすべて空。問いだけがあって、答えのない表。",
    demo: `<table border="1">\n  <tr><th>問い</th><th>答え</th></tr>\n  <tr><td>なぜ、別れたの</td><td></td></tr>\n  <tr><td>いま、どこにいるの</td><td></td></tr>\n</table>`,
    note: "td/th は tr（行）の中に置く。colspan・rowspan で升を結合できる。"
  },
  {
    tag: "thead / tbody / tfoot", display: "<thead> <tbody> <tfoot>", category: "table",
    summary: "表を、見出し部・本体部・脚部の三つに意味づける。",
    poetic: "表にも、始まりと本体と終わりがある。thead は宣言、tbody は積み重なる日々、tfoot は総括。長い表を印刷すると thead は各頁の頭でくり返される——何度でも立ち返る、冒頭の一行。",
    spark: "tfoot に「合計」ではなく、結論めいた一行を置く。積み重ねた tbody の日々の、その果ての言葉。",
    demo: `<table border="1">\n  <thead><tr><th>日々</th></tr></thead>\n  <tbody>\n    <tr><td>会った</td></tr>\n    <tr><td>笑った</td></tr>\n    <tr><td>別れた</td></tr>\n  </tbody>\n  <tfoot><tr><td>……それだけのことだった</td></tr></tfoot>\n</table>`,
  },
  {
    tag: "colgroup / col", display: "<colgroup> <col>", category: "table",
    summary: "表の「列」をまとめて指し、列ごとの性質を一括で扱う。",
    poetic: "行ではなく、縦の連なりに名を与える視点。span でいくつかの列を束ねられる。横（tr）に流れる時間に対し、縦（col）はそれを貫く、もうひとつの軸。",
    spark: "二列の表で、片方の列だけを束ね、「変わらないもの／移ろうもの」を縦に対比する。",
    demo: `<table border="1">\n  <colgroup><col><col></colgroup>\n  <tr><td>かわらないもの</td><td>うつろうもの</td></tr>\n  <tr><td>名前</td><td>こえ</td></tr>\n</table>`,
    note: "colgroup/col は表の冒頭に置き、列単位で意味づける（本来は主にCSS用だが、構造として列を束ねられる）。"
  },

  // ── フォーム・入力 ─────────────────────────────────────
  {
    tag: "form", display: "<form>", category: "form",
    summary: "入力をまとめ、どこかへ送るための器。",
    poetic: "『送信』という行為の器。action を空にすれば、送り先のないフォーム。書いても、押しても、どこにも届かない申し込み用紙。それ自体が片想いの構造。",
    spark: "宛先のない申込書を作る。『あなたへの気持ち申請フォーム』、送信ボタンは押せるが、何も起きない。",
    demo: `<form>\n  <p>これは、どこにも送られません。</p>\n  <label>ひとこと: <input type="text" value="さようなら"></label>\n</form>`,
  },
  {
    tag: "input", display: '<input type="text">', category: "form",
    summary: "一行のテキスト入力欄。読者が文字を書き込める。",
    poetic: "読者の手に、ペンを渡す。value で最初から言葉を仕込んでおき、placeholder で薄い問いを浮かべる。読者が書き換えれば、詩は読者のものになる。",
    spark: "詩の一部を空欄にし、value も placeholder も置く。読者が消すか、書き足すかで、詩が変わる。",
    demo: `<p>わたしは <input type="text" value="ここにいる" size="8"> と書いて、すぐに消した。</p>\n<p><input type="text" placeholder="あなたの名前を、まだ知らない" size="30"></p>`,
  },
  {
    tag: "textarea", display: "<textarea>", category: "form",
    summary: "複数行のテキスト入力欄。長い文章を書き込める。",
    poetic: "読者に渡す、白い原稿用紙。書きかけの手紙を仕込んでおける。読者は続きを書くことも、すべて消すこともできる。詩を、共作にする装置。",
    spark: "書きかけの手紙を textarea に入れておく。『拝啓、…』のあと、続きは読者に委ねる。",
    demo: `<textarea rows="4" cols="30">拝啓。\nあれから、ずいぶん経ちました。\nわたしは、</textarea>`,
  },
  {
    tag: "button", display: "<button>", category: "form",
    summary: "押せるボタン。JSなしでは、押しても基本は何も起きない。",
    poetic: "押せるのに、何も起こらないボタン。その『無反応』こそ詩になる。押したくなる衝動と、虚しさ。期待と、沈黙。",
    spark: "切実な言葉のボタンを並べる。『もう一度会いたい』を押しても、画面は微動だにしない。",
    demo: `<button type="button">もう一度、会いたい</button>\n<button type="button">時間を、巻き戻す</button>`,
  },
  {
    tag: "checkbox / radio", display: '<input type="checkbox/radio">', category: "form",
    summary: "チェックボックス（複数選択）と、ラジオボタン（択一）。",
    poetic: "読者に『選ばせる』。checkbox は気持ちの複数選択、radio は『どれかひとつ』という残酷な択一。checked を仕込めば、最初から決められた答え。",
    spark: "『今日の気分』をラジオボタンにし、すべてを選べないようにする。あるいは、選択肢を一つしか用意しない。",
    demo: `<p>あの日に戻れるなら:</p>\n<label><input type="radio" name="x"> 戻る</label><br>\n<label><input type="radio" name="x" checked> 戻らない</label>`,
  },
  {
    tag: "input type=range", display: '<input type="range">', category: "form",
    summary: "つまみを左右に動かすスライダー。",
    poetic: "読者が指で動かせる、量の詩。min と max のあいだを、つまみが行き来する。『どれくらい好きか』『どれくらい遠いか』を、読者自身に決めさせる。目盛りのない感情の物差し。",
    spark: "ラベルだけ付けて、両端に言葉を置く。『嫌い ——○—— 好き』のつまみを、読者に委ねる。",
    demo: `<p>あなたへの距離:</p>\n<label>ここ <input type="range" min="0" max="100" value="50"> 宇宙の果て</label>`,
  },
  {
    tag: "input type=color", display: '<input type="color">', category: "form",
    summary: "色を選ぶための、小さな見本。クリックでパレットが開く。",
    poetic: "感情に、色を選ばせる。value で初期の色を置ける。読者がパレットを開いて、その日の気分の色を選ぶ——詩に、可変の色を一点だけ灯す。",
    spark: "『今日のこころの色』をひとつだけ選ばせる。言葉ではなく、色で答えさせる詩。",
    demo: `<p>きのうの空の色を、覚えていますか。</p>\n<input type="color" value="#8899cc">`,
  },
  {
    tag: "select / option", display: "<select> <option>", category: "form",
    summary: "ドロップダウンの選択肢。option で項目を並べる。",
    poetic: "畳まれた選択肢。開くまで、一つしか見えない。select は『可能性が隠れている』状態そのもの。selected で初期値を決め、運命を仕込める。",
    spark: "『この物語の結末』を select にする。どれを選んでも、表示は変わらないのに、選ばせる。",
    demo: `<label>この恋の結末:\n  <select>\n    <option>実る</option>\n    <option selected>実らない</option>\n    <option>まだ、わからない</option>\n  </select>\n</label>`,
  },
  {
    tag: "datalist", display: "<datalist>", category: "form",
    summary: "入力欄に、入力候補をそっと添える。",
    poetic: "書こうとすると、ささやかれる候補たち。読者が一文字打つと、用意しておいた言葉が下から現れる。誘導。先回り。言葉を、そっと差し出す手。",
    spark: "問いの入力欄に、ありえない候補ばかりを datalist で仕込む。読者の指を、思わぬ言葉へ導く。",
    demo: `<label>あなたが探しているのは:\n  <input list="opt" placeholder="一文字、打ってみて">\n</label>\n<datalist id="opt">\n  <option value="許し">\n  <option value="許される理由">\n  <option value="許せない自分">\n</datalist>`,
  },
  {
    tag: "progress", display: "<progress>", category: "form",
    summary: "進み具合を示すバー。value と max で満ち具合が決まる。",
    poetic: "満ちていく／満たない、を一本のバーで描く。人生の残り、忘却の進み具合、傷の癒え方。value を max に届かせないことで、永遠に終わらない何かを描ける。",
    spark: "『立ち直り』の progress を、ほんの少しだけ満たして止める。あるいは value を空にして、まだ始まってすらいない何かを。",
    demo: `<p>立ち直り:</p>\n<progress value="3" max="100"></progress>\n<p>忘却:</p>\n<progress value="98" max="100"></progress>`,
  },
  {
    tag: "meter", display: "<meter>", category: "form",
    summary: "ある範囲の中での『今の値』を示すゲージ。",
    poetic: "progress が『進み』なら、meter は『状態』。タンクの残り、温度、気力。low/high/optimum で『どこが良い状態か』まで指定でき、色が変わる。感情の計器。",
    spark: "『こころの残量』を meter にする。低い領域を optimum にして、満ちていることを不調として描く。",
    demo: `<p>きょうの元気:</p>\n<meter value="2" min="0" max="10" low="3" high="7" optimum="9"></meter>`,
  },
  {
    tag: "output", display: "<output>", category: "form",
    summary: "計算や処理の『結果』を置くための要素。",
    poetic: "答えが入るべき場所。けれど、JSなしでは、その答えは永遠に空のまま。結果の出ない計算式、出力されない解。空っぽの <output> は、待ち続ける器。",
    spark: "切実な問いの式を書き、<output> を空のままにする。『さみしさ ÷ 時間 = 　』。",
    demo: `<p>あなた − わたし = <output></output></p>`,
  },
  {
    tag: "fieldset / legend", display: "<fieldset> <legend>", category: "form",
    summary: "入力欄をグループにし、legend でその枠に題をつける。",
    poetic: "問いの群れを、ひとつの枠で囲う。legend は、その枠に掛けられた表札。『記入してはいけない欄』『答えなくてよい質問』という名の枠を作れる。",
    spark: "<legend> に『以下、すべて任意』と書き、答えようのない質問だけを並べる。",
    demo: `<fieldset>\n  <legend>あなたについて（任意）</legend>\n  <p><label>本当の名前: <input></label></p>\n  <p><label>まだ言えていないこと: <input></label></p>\n</fieldset>`,
  },
  {
    tag: "label", display: "<label>", category: "form",
    summary: "入力欄に結びつく「名札」。クリックでその欄が反応する。",
    poetic: "入力欄に寄り添う、呼び名。入れ子や for=id で欄と結ばれ、ラベルをクリックすると、対の欄が目を覚ます（チェックが入る、カーソルが灯る）。言葉と、それが指すものとの、目に見える絆。",
    spark: "チェックボックスのラベルに、長い告白文を書く。文のどこに触れても、ひとつの「はい」に印が付く。",
    demo: `<p><label><input type="checkbox"> この一文の、どこに触れても、わたしは「はい」と答えます。</label></p>`,
    note: "label でフォーム部品を包む（または for=id で結ぶ）と、ラベル全体がその部品の操作面になる。JS不要。"
  },
  {
    tag: "optgroup", display: "<optgroup>", category: "form",
    summary: "select の選択肢（option）を、見出し付きのグループに束ねる。",
    poetic: "選択肢にも、属する「群れ」がある。optgroup の label が、選択肢たちの上に小さな見出しを掛ける。畳まれたドロップダウンの中に、分類された世界——選べる感情の目録。",
    spark: "「選べる気持ち」を〈言えるもの〉〈言えないもの〉に分け、その見出しの下にそれぞれの感情を並べる。",
    demo: `<label>いま、いちばん近いのは:\n  <select>\n    <optgroup label="言えるもの">\n      <option>うれしい</option>\n      <option>たのしい</option>\n    </optgroup>\n    <optgroup label="言えないもの">\n      <option>さみしい</option>\n      <option>こわい</option>\n    </optgroup>\n  </select>\n</label>`,
  },
  {
    tag: "search", display: "<search>", category: "form",
    summary: "検索や絞り込みのための領域を意味づける、新しめの要素。",
    poetic: "「探している」という状態そのものに、枠を与える要素。中身は検索欄でなくてもいい。<search> という器は、「何かを探しつづけている」気配を、文書の構造に刻む。",
    spark: "<search> の中に、答えの出ない問いだけを置く。永遠に検索しつづけている、出口のない一画。",
    demo: `<search>\n  <p>ずっと、さがしています。</p>\n  <label>みつからないもの: <input type="search" placeholder="（入力しても、見つからない）"></label>\n</search>`,
    note: "比較的新しい意味要素。検索・フィルタUIをまとめる「ランドマーク」を表す。"
  },

  // ── 埋め込み・メディア ─────────────────────────────────
  {
    tag: "img", display: "<img>", category: "embed",
    summary: "画像。alt 属性に、画像が見えないときの代わりの言葉を書く。",
    poetic: "alt 属性こそ詩の隠し場所。src を空にすれば画像は表示されず、alt のテキストだけが残る——『見えない絵を説明する言葉』だけの作品。画像なき画像の詩。",
    spark: "src を意図的に壊し、alt にだけ詩を書く。誰の目にも映らない絵を、言葉で見せる。",
    demo: `<img src="" alt="ここには、二度と撮れない写真が表示されるはずでした。">`,
    note: "存在しない src は『壊れた画像』になり、alt のテキストが現れる。これも純HTMLの仕掛け。"
  },
  {
    tag: "picture / source", display: "<picture> <source>", category: "embed",
    summary: "画面の幅などに応じて、表示する画像を切り替える。",
    poetic: "見る者の環境で、姿を変える絵。media 属性で『画面が狭いとき』『広いとき』に別の画像を出せる。読者のデバイス次第で、別の詩が立ち上がる。",
    spark: "スマホでは別の絵、PCでは別の絵。同じURLが、見る人によって違う顔を見せる仕掛けに。",
    demo: `<picture>\n  <source media="(max-width: 600px)" srcset="">\n  <img src="" alt="画面の幅で、わたしの見え方は変わります。">\n</picture>`,
  },
  {
    tag: "audio", display: "<audio>", category: "embed",
    summary: "音声プレイヤー。controls で再生バーが出る。",
    poetic: "詩に、本物の音を。loop で無限に繰り返す環境音、autoplay の是非。src のない <audio controls> は、再生できないプレイヤー——鳴らない音楽という存在。",
    spark: "再生できない音声プレイヤーを置き、その下に『この曲を、あなたはもう聴けない』と書く。",
    demo: `<audio controls src=""></audio>\n<p>（再生ボタンはあるのに、音は鳴らない）</p>`,
  },
  {
    tag: "video", display: "<video>", category: "embed",
    summary: "動画プレイヤー。poster で表紙画像を指定できる。",
    poetic: "動かない動画。poster だけを置き、再生しても何も起きない映像。止まったままの一枚と、『再生できる』という嘘の約束。",
    spark: "poster に一枚の絵、src は空。永遠に再生されない映画の、ポスターだけを展示する。",
    demo: `<video controls poster="" width="240">\n  <p>この動画は、もう存在しません。</p>\n</video>`,
  },
  {
    tag: "track", display: "<track>", category: "embed",
    summary: "動画・音声に、字幕やキャプションを重ねる。",
    poetic: "映像の上を流れる、もう一つの声。字幕は、音とずれてもいい。映像が無音でも、字幕だけが語り続ける。声なき声の、テキスト。",
    spark: "音のない映像に、語りすぎる字幕をつける。あるいは、内容と無関係な字幕を流す。",
    demo: `<video controls width="240">\n  <track kind="captions" label="きこえない声" default>\n  <p>字幕だけが、ここにいる。</p>\n</video>`,
  },
  {
    tag: "iframe", display: "<iframe>", category: "embed",
    summary: "別のHTML文書を、窓のように埋め込む。",
    poetic: "ページの中に開いた、別世界への窓。自分自身を src にすれば、入れ子の無限——詩の中に同じ詩が、その中にまた同じ詩が。srcdoc で、その場に小さな別文書を書き込める。",
    spark: "srcdoc に、本文と矛盾する『もう一つのページ』を埋め込む。窓の向こうに、別の真実を見せる。",
    demo: `<iframe srcdoc="<p>これは、窓の向こうの世界です。</p>" width="260" height="60"></iframe>`,
    note: "srcdoc の中身は完結したHTML文書として描かれる。窓を入れ子にもできる。"
  },
  {
    tag: "svg", display: "<svg>", category: "embed",
    summary: "図形を、数値の座標で描くベクター画像。HTMLに直接書ける。",
    poetic: "CSSもJSも使わず、HTMLの中に線や円を描ける。<svg> の中の <text> は、回転も、曲線に沿わせることもできる。言葉を、図形として配置する純粋な手段。",
    spark: "円周に沿って文字を流す、線で言葉を貫く。文字を『絵』として置く。",
    demo: `<svg width="200" height="80">\n  <circle cx="40" cy="40" r="30" fill="none" stroke="black"/>\n  <text x="85" y="45">ここに、穴がある</text>\n</svg>`,
    note: "SVG はそれ自体が言語。HTML に素のまま埋め込め、style 属性なしでも図形と文字を置ける。"
  },
  {
    tag: "map / area", display: "<map> <area>", category: "embed",
    summary: "画像の上に、クリックできる領域を重ねる。",
    poetic: "一枚の絵の、見えない急所。画像のどの部分に触れると、どこへ飛ぶか。表向きはただの絵、しかし特定の場所だけが秘密の扉になっている。",
    spark: "風景画の、ある一点だけにリンクを仕込む。読者が偶然そこに触れたとき、別の言葉が開く。",
    demo: `<img src="" alt="この絵の、どこかに扉がある" usemap="#m" width="200" height="120">\n<map name="m">\n  <area shape="circle" coords="100,60,30" href="#" alt="ここ">\n</map>`,
  },
  {
    tag: "object / embed", display: "<object> <embed>", category: "embed",
    summary: "外部リソース（PDFや他文書など）を、文書内に取り込む。",
    poetic: "他のものを丸ごと飲み込む器。読み込めなかったときに表示される『代わりの内容』を仕込める。失敗が前提の埋め込み——その代替テキストこそが、本当の中身。",
    spark: "読み込めない object の代わりに、『ここにあったものは、もう失われました』と表示させる。",
    demo: `<object data="" type="application/pdf" width="240" height="60">\n  ここにあったはずのものは、見つかりませんでした。\n</object>`,
  },
  {
    tag: "canvas", display: "<canvas>", category: "embed",
    summary: "JavaScript で絵を描くための、空白の画布。",
    poetic: "JSを使わないと決めたこの世界では、永遠に塗られない画布。<canvas> は、何も描かれないまま、ただ「描けるはずだった空間」として在る。中に書いた言葉は、canvas が使えない環境にだけ現れる「代わりの絵」になる。",
    spark: "空の canvas を置き、その中に「ここに描かれるはずだった絵」を言葉で書く。塗られない画布の、不在の絵。",
    demo: `<canvas width="240" height="60">ここには、JSがあれば絵が描けました。今は、この一文だけが残っています。</canvas>`,
    note: "JSなしでは何も描画されない。対応ブラウザでは空白、非対応では中のテキストが見える。"
  },

  // ── 対話 interactive ──────────────────────────────────
  {
    tag: "details / summary", display: "<details> <summary>", category: "interactive",
    summary: "クリックで開閉する折りたたみ。summary が見出し。",
    poetic: "純HTMLだけで作れる、最強の『仕掛け』。閉じた summary に問いを、開いた中に答えを。読者が開くまで、詩は半分しか存在しない。秘密、告白、ネタばらし。open 属性で最初から開けておくことも、ずっと隠しておくこともできる。入れ子にすれば、何重もの扉。",
    spark: "summary に当たり障りのない一言、中に本音を。あるいは details を入れ子にして、開けても開けても、まだ奥がある構造に。",
    demo: `<details>\n  <summary>なんでもない一日でした。</summary>\n  <p>本当は、一日じゅう、あなたのことを考えていました。</p>\n  <details>\n    <summary>それと、もうひとつ。</summary>\n    <p>……いえ、やっぱり、なんでもありません。</p>\n  </details>\n</details>`,
    note: "JS不要。これだけでインタラクティブな詩が組める、純HTMLの主役級。"
  },
  {
    tag: "dialog", display: "<dialog>", category: "interactive",
    summary: "ダイアログ（小窓）。open 属性で表示される。",
    poetic: "画面の手前にせり出す、もう一つの層。open を付ければ、開いたまま固定された告白の窓。閉じられない問い、消せない通知として置ける。",
    spark: "<dialog open> に、本文を遮るような一言を置く。読者は、それを閉じる手段を持たない。",
    demo: `<dialog open>\n  <p>あなたは今、ここを読んでいます。<br>それだけが、確かなことです。</p>\n</dialog>`,
    note: "JSなしでも open 属性で表示できる(閉じるのには本来JSが要る——閉じられないことを逆手に取れる)。"
  },

  // ── メタ・隠れたもの ───────────────────────────────────
  {
    tag: "meta", display: "<meta>", category: "meta",
    summary: "文書についての情報。文字コード、説明文、自動更新などを指定。",
    poetic: "本文に現れない、文書の『настройка(設定)』。meta refresh で、一定秒後に自分自身へ飛び、ページを無限に再読み込みさせられる——終わらない反復、抜け出せないループを純HTMLで作れる。",
    spark: "meta refresh で数秒ごとにページを更新させ、そのたびに『同じ朝』が始まる詩を作る。",
    demo: `<!-- &lt;meta http-equiv="refresh" content="5"&gt; を書くと、5秒ごとにページが甦る -->\n<p>このページは、何度でも、最初からやり直せます。</p>`,
    note: "<meta http-equiv=\"refresh\" content=\"秒;url=…\"> で自動遷移・自動更新。ループ詩の核になる。"
  },
  {
    tag: "noscript", display: "<noscript>", category: "meta",
    summary: "JavaScript が無効なときだけ表示される内容。",
    poetic: "『JSを使わない』という、この企て全体への祝福。noscript の中身は、JSを切った世界でだけ現れる。素のHTMLだけを愛する者への、隠されたメッセージ。",
    spark: "noscript の中に、本当の詩を隠す。スクリプトを切った人にだけ、本文が立ち上がる作品。",
    demo: `<noscript>\n  <p>ようこそ。ここは、何も動かない世界です。</p>\n</noscript>\n<p>（JSが有効なら、上の言葉は隠れています）</p>`,
  },
  {
    tag: "template", display: "<template>", category: "meta",
    summary: "描画されないまま、文書の中に保持される内容。",
    poetic: "そこに在るのに、見えないもの。<template> の中身は、HTMLとして正しく存在するのに、画面には決して現れない。語られなかった言葉の、完全な保管庫。",
    spark: "<template> の中に、いちばん言いたかったことを書く。読者には決して見えない、けれど確かにそこに在る一行。",
    demo: `<template>\n  <p>ほんとうは、こう言いたかった。</p>\n</template>\n<p>（上の段落は、ソースには在るが、画面には無い）</p>`,
  },
  {
    tag: "comment", display: "<!-- … -->", category: "meta",
    summary: "コメント。ブラウザには表示されないが、ソースには残る注釈。",
    poetic: "もっとも純粋な『隠し場所』。画面には決して出ず、しかしソースを覗いた者だけが出会える。詩の余白、作者だけのつぶやき、読者への秘密のメッセージ。",
    spark: "本文と正反対のことを、コメントに書く。表に『さようなら』、ソースの闇に『行かないで』。",
    demo: `<p>これでおしまいです。</p>\n<!-- うそ。本当は、まだ終わってほしくない。 -->`,
    note: "「ソースを表示」する読者だけが見られる層。HTMLには『見えない本文』がある。"
  },
  {
    tag: "base", display: "<base>", category: "meta",
    summary: "そのページの全リンクの『基準』や、開き方を一括指定する。",
    poetic: "すべての行き先を、ひとつの言葉で決める要素。target=\"_blank\" を base に置けば、このページのどのリンクも、新しい窓を開く。ページ全体の『振る舞いの前提』を、一行で定める。",
    spark: "base で全リンクの基準を、実在しない場所に置く。どこへ行こうとしても、同じ宛先に集まる構造に。",
    demo: `<!-- &lt;base target="_blank"&gt; を置くと、以後すべてのリンクが新しい窓で開く -->\n<p>ここから先は、すべて、別の窓のむこう。</p>`,
  },
  {
    tag: "head / body", display: "<head> <body>", category: "meta",
    summary: "head は文書の舞台裏（表示されない情報）、body は舞台（表示される中身）。",
    poetic: "一篇の文書は、見えない頭（head）と、見える体（body）でできている。head に書いたことは画面に出ないのに、文書のすべてを左右する。表に出ない思考と、表に出る言葉。",
    spark: "head に置けるもの（title・meta・base…）を「内面」、body を「外面」と捉え、その食い違いを作品にする。",
    demo: `<!-- &lt;head&gt; は舞台裏。観客（読者）には見えないまま、芝居の全部を決めている。 -->\n<p>あなたが今読んでいるこの言葉は、&lt;body&gt; の中にいます。</p>`,
    note: "head の中身（title/meta/base/link/style/script）は画面に現れないが、文書の振る舞いを定める。"
  },
  {
    tag: "link", display: "<link>", category: "meta",
    summary: "外部リソースや、別ページとの「関係」を宣言する（head 内に置く）。",
    poetic: "本文に現れない「関係」を宣言する要素。rel=\"next\"/\"prev\" で見えない前後関係を、rel=\"canonical\" で「本物はあちら」と告げる。どこにも表示されないのに、文書同士の縁を結ぶ。",
    spark: "rel=\"prev\"/\"next\" で、実在しない前後の頁との関係だけを宣言する。読めない章に挟まれた一篇。",
    demo: `<!-- &lt;link rel="prev" href="昨日.html"&gt; … 見えないが、確かに「昨日」と結ばれている -->\n<p>この頁には、見えない縁（えにし）がある。</p>`,
    note: "<head> 内に置く。画面には出ないが、ブラウザや検索エンジンが読む「関係」の宣言。"
  },
  {
    tag: "style", display: "<style>", category: "meta",
    summary: "CSS を書き込むための要素。…この企てが、あえて使わないと決めたもの。",
    poetic: "この辞典が、あえて封印した力。<style> ひとつで、文字は色も大きさも配置も自在になる。それを「使わない」と決めることが、この詩作の出発点だった。封じることで、HTML本来の声が聞こえてくる。",
    spark: "あえて空の <style></style> だけを置く。「ここに、使わなかった力がある」という、不在の宣言。",
    demo: `<!-- &lt;style&gt; … この中に一行書けば、すべてを変えられた。だから、書かなかった。 -->\n<p>ここには、何の装飾もありません。それが、この詩のかたちです。</p>`,
    note: "純HTMLの「作品」では使わないと決めた要素。知っておくことで、その不在が意味を持つ。"
  },
  {
    tag: "script", display: "<script>", category: "meta",
    summary: "JavaScript を書き込む／読み込む要素。これも、あえて使わないもの。",
    poetic: "もうひとつの封印。<script> は文書に動きと知能を与える。それを断つことで、HTMLは「ただそこに在るだけ」の純粋さを取り戻す。動かないことを選んだ詩。type を未知の値にすれば、実行されない「ただのテキストの容れ物」にもなる。",
    spark: "<script type=\"text/plain\"> の中に詩を隠す。実行されず、画面にも出ず、ソースにだけ眠る言葉。noscript と対にしても面白い。",
    demo: `<!-- &lt;script&gt; を一行も書かない。それが、この世界の約束。 -->\n<p>ここでは、何も起こりません。何も起こらないことだけが、起こります。</p>`,
    note: "type を未知の値にすると実行されず、ソースにだけ残る隠れたテキスト置き場になる。"
  },
  {
    tag: "slot", display: "<slot>", category: "meta",
    summary: "他の内容が「差し込まれる」場所の予約（主に Web Components 用）。",
    poetic: "中身が、まだ無い場所。slot は「ここに、いつか何かが入る」という空席。本来は影の中（Shadow DOM）でしか働かないが、その「差し込まれるのを待つ穴」という概念じたいが、不在と期待の詩になる。",
    spark: "「ここに、あなたの言葉が入るはずでした」という空席として、slot を概念ごと詩に引用する。",
    demo: `<p>ここに、<slot>（まだ誰も座っていない席）</slot>があります。</p>`,
    note: "実際に機能するのは Shadow DOM 内のみ。通常は中の既定テキストがそのまま見える。"
  },

  // ── 文字・記号 ─────────────────────────────────────────
  {
    tag: "&nbsp;", display: "&nbsp;", category: "char",
    summary: "改行しない空白（ノーブレークスペース）。",
    poetic: "ふたつの語を、決して引き離さない絆。&nbsp; で繋がれた言葉は、画面の端でも切り離されない。『君と僕』を、何があっても同じ行に留まらせる。空白なのに、結びつき。",
    spark: "ある二語だけを &nbsp; で固く結び、ほかは自由に折り返させる。離れないものと、離れていくもの。",
    demo: `<p>世界のすべてが折り返しても、きみ&nbsp;と&nbsp;ぼく だけは、おなじ行にいる。</p>`,
  },
  {
    tag: "&shy;", display: "&shy;", category: "char",
    summary: "ふだんは見えず、行末でだけ現れるハイフン（ソフトハイフン）。",
    poetic: "見えない切れ目。&shy; は、普段は姿を隠し、行の端に来たときだけハイフンとして現れる。言葉の中に潜む、潜在的な裂け目。条件次第で露わになる傷。",
    spark: "長い一語の中に &shy; を仕込み、画面幅によって割れる場所が変わる言葉を作る。",
    demo: `<p>かなし&shy;み、よろこ&shy;び、あいま&shy;いさ。</p>\n<p>（窓を狭めると、見えなかった切れ目が現れる）</p>`,
  },
  {
    tag: "ダッシュと約物", display: "&mdash; &ndash; &hellip;", category: "char",
    summary: "全角ダッシュ、半角ダッシュ、三点リーダなどの約物。",
    poetic: "言葉と言葉のあいだに引かれる、息の長さ。&mdash;(——) は断ち切りと飛躍、&hellip;(…) は語尾の余韻、消えていく声。文字でない記号が、沈黙の長さを刻む。",
    spark: "言葉を最小限にし、約物だけで感情の起伏を描く。『——。…………。——』",
    demo: `<p>行こうか&mdash;&mdash;いや、やっぱり&hellip;</p>`,
  },
  {
    tag: "&zwnj; / &zwj;", display: "&zwnj; &zwj;", category: "char",
    summary: "幅ゼロの非接合子／接合子。文字をくっつける／離す、見えない制御文字。",
    poetic: "目に見えない文字。幅も形も持たないのに、確かにそこに在り、隣の文字の繋がり方を変える。存在するのに見えない——『気配』そのものを文に置く。",
    spark: "見た目は同じなのに、見えない制御文字を含む語と含まない語を並べる。同じに見えて、同じでない二つ。",
    demo: `<p>ここに、見えない文字がある →[&zwnj;]← この括弧の中。</p>`,
  },
  {
    tag: "実体参照", display: "&amp; &lt; &gt; &#…;", category: "char",
    summary: "HTMLで特別な意味を持つ記号を、文字として書くための表記。",
    poetic: "HTMLそのものを、詩の素材にする。&lt; と &gt; と書けば、画面に < > が現れる——タグの『見た目』を、本文として展示できる。&#数字; で、世界中のあらゆる文字や記号を呼び出せる。",
    spark: "タグの記法そのものを詩にする。画面に &lt;愛&gt; と表示し、『閉じられないタグ』を題材にする。",
    demo: `<p>&lt;こころ&gt; を開いたまま、閉じるのを忘れた。</p>\n<p>&#9731; &#10084; &#9834;（雪・心・音符）</p>`,
    note: "&#数字; や &#x16進; で Unicode のどの文字も書ける。タグ記号すら本文にできる。"
  },

  // ── 属性の力 ───────────────────────────────────────────
  {
    tag: "contenteditable", display: 'contenteditable', category: "attr",
    summary: "任意の要素を、その場で編集可能にする属性。",
    poetic: "どんな要素にも付けられる、最強の対話属性。読者は本文を、その場で書き換え、消し、書き足せる。詩が、読者の指先で変形する。『あなたが、この詩を完成させてください』。JSすら不要。",
    spark: "完成した詩に contenteditable を付け、『手を入れてください』とだけ添える。壊される前提の作品。",
    demo: `<p contenteditable>この一行は、あなたが書き換えられます。消してみても、足してみても、いい。</p>`,
    note: "属性ひとつでページが編集可能に。純HTMLで読者参加型の詩が作れる。"
  },
  {
    tag: "title 属性", display: 'title="…"', category: "attr",
    summary: "どの要素にも付けられる、マウスを乗せると出るツールチップ。",
    poetic: "あらゆる言葉の裏に、もう一枚。title 属性は、カーソルを乗せた者だけに、隠したテキストを見せる。表の言葉と、その下に潜ませた本音。触れた者だけが知る、二層目の詩。",
    spark: "一文のすべての単語に title を付け、表の文とまったく違う『裏の文』を仕込む。なぞった者だけが読める。",
    demo: `<p>\n  <span title="でも、">おはよう。</span>\n  <span title="ほんとうは、">いい天気だね。</span>\n  <span title="行きたくない。">いってきます。</span>\n</p>\n<p><small>（言葉の上に、しばらくカーソルを置いてみて）</small></p>`,
  },
  {
    tag: "download", display: 'download', category: "attr",
    summary: "リンクを『開く』のではなく『保存させる』ための属性。",
    poetic: "持ち帰らせる、という行為。<a download> は、リンク先を表示せず、ファイルとして手元に残させる。読者に『これを、あなたのものとして持っていって』と差し出す手。",
    spark: "詩そのものを download 可能にし、『これは、あなたが持っていてください』と添える。",
    demo: `<a href="data:text/plain,わすれないで" download="memo.txt">この一言を、持ち帰る</a>`,
  },
  {
    tag: "accesskey", display: 'accesskey', category: "attr",
    summary: "キーボードの一打で、その要素に飛べるショートカット。",
    poetic: "ある一文字のキーが、ある言葉への秘密の扉になる。accesskey=\"k\" を知る者だけが、キーひとつでそこへ到達できる。隠されたショートカット、合言葉のような操作。",
    spark: "詩のどこかに accesskey を仕込み、別の場所に『◯のキーを押して』と暗号のように残す。",
    demo: `<a href="#secret" accesskey="s">（押し方を知る者だけが、ここを開ける）</a>\n<p id="secret">よく、たどり着きましたね。</p>`,
    note: "起動キーはブラウザにより Alt+◯ など。隠し操作として詩に織り込める。"
  },
  {
    tag: "lang / dir", display: 'lang  dir', category: "attr",
    summary: "その部分の言語と、文字の流れる向きを指定する。",
    poetic: "文の一部だけ、別の言語・別の向きにできる。lang を切り替えれば、引用符や約物の形が変わる。dir=\"rtl\" で、その一節だけ右から左へ流れる。多言語が混ざり合う、境界の詩。",
    spark: "一篇の中で lang を次々に切り替え、どの言語にも属さない『あいだ』の言葉を書く。",
    demo: `<p>これは <span lang="en">a quiet word</span>、そして <span dir="rtl">逆向きの呟き</span>。</p>`,
  },
  {
    tag: "hidden", display: 'hidden', category: "attr",
    summary: "その要素を、画面から完全に隠す属性。",
    poetic: "在るのに、見えない。hidden を付けた要素は、ソースには存在し、検索にもかかるのに、画面には現れない。隠した言葉、伏せられた一節。読者が決して目にしない、けれど確かにある本文。",
    spark: "本文の合間に hidden の段落を挟む。語られた言葉と、語られなかった言葉が、交互に積もる。",
    demo: `<p>おやすみ。</p>\n<p hidden>行かないで。</p>\n<p>また明日。</p>`,
  },
  {
    tag: "translate", display: 'translate="no"', category: "attr",
    summary: "自動翻訳に『この部分は訳すな』と指示する属性。",
    poetic: "翻訳を、拒む言葉。translate=\"no\" は、機械翻訳に『ここには触れるな』と告げる。名前、固有の響き、訳されたくない一語——原語のまま留まることを選んだ言葉。",
    spark: "詩の中の、たった一語にだけ translate=\"no\" を付ける。どの言語に変えられても、その言葉だけは変わらない。",
    demo: `<p>すべては移ろうけれど、<span translate="no">きみの名前</span>だけは、訳されない。</p>`,
  },
  {
    tag: "tabindex", display: 'tabindex', category: "attr",
    summary: "Tabキーで要素を辿る順番を、自分で決める属性。",
    poetic: "読者の『Tabキー』に、巡礼の順路を引く。tabindex の数値で、フォーカスが移る順番を操れる。本文の並びとは違う順序で、言葉から言葉へ飛ばせる。隠された読み順。",
    spark: "本文は普通に並べつつ、tabindex で『Tabキーで辿ると別の詩になる』二重構造を作る。",
    demo: `<p>\n  <span tabindex="3">最後に</span>\n  <span tabindex="1">まず</span>\n  <span tabindex="2">つぎに</span>\n</p>\n<p><small>（Tabキーを連打すると、別の順で光る）</small></p>`,
  },
  {
    tag: "spellcheck", display: 'spellcheck', category: "attr",
    summary: "入力中の文字に、綴り間違いの波線を出す／出さないを指定。",
    poetic: "『正しさ』を、出すか消すか。spellcheck=\"true\" の編集欄では、書いた言葉に赤い波線が引かれる——機械が『これは間違いだ』と告げる。造語や詩的破格を、わざと誤りとして波線まみれにできる。",
    spark: "編集可能な詩に spellcheck=\"true\" を付け、造語だらけの一節を書く。機械が引く波線も、作品の一部にする。",
    demo: `<p contenteditable spellcheck="true">ここに、辞書にない言葉を書いてみて。きかいが、まちがいだと波線をひく。</p>`,
  },
];

// 詩の方位 — タグを選んだあと、どう使うかをけしかける指南（Oblique Strategies 風）
const STRATEGIES = [
  "繰り返しは、祈りになる。同じ要素を、しつこく重ねてみる。",
  "閉じているものを、ひとつだけ開けておく。",
  "見えないところに、本当のことを書く。",
  "読者に、書き換えさせる。完成を手放す。",
  "タグの名前そのものを、意味として使う。",
  "余白を主役にする。中身を捨てる勇気。",
  "壊れた表示を、わざと残す。エラーを詩にする。",
  "表に出る言葉と、裏に隠す言葉を、正反対にする。",
  "時間を、datetime として正確に刻む。あるいは、嘘の時刻を刻む。",
  "ひとつの言葉に、ふたつの読みを同時に与える。",
  "順序を、逆にする。終わりから始める。",
  "定義することで、世界を名づけ直す。",
  "引用の出典を、偽る。声を、他人のものにする。",
  "押せるのに、何も起きない。その無反応を、味わわせる。",
  "読者の画面の幅で、詩の形が変わるようにする。",
  "alt 属性にだけ、本音を書く。見えない絵の、見える言葉。",
  "選択肢を、ひとつしか用意しない。選ばせて、選ばせない。",
  "ループさせる。終わらない。抜け出せない。",
  "入れ子にする。開けても開けても、まだ奥がある。",
  "二つの声を、ひとつの段落で同時に流す。",
  "数値の裏に、感情を隠す。value に、本心を。",
  "送り先のないフォームを作る。届かない手紙の構造。",
  "見える層、なぞると出る層、ソースにだけある層——三層に書く。",
  "正しさを拒む。機械が『間違い』と言う言葉を、あえて選ぶ。",
  "ひとつだけ、向きを変える。みんなと逆に流れる、一語。",
  "満たさない。バーを、最後まで届かせない。",
  "持ち帰らせる。読者の手元に、一語だけ残す。",
  "リンク先を、空にする。どこへも行けない案内。",
  "最小限の言葉と、最大限の記号。約物だけで、感情を描く。",
  "属性ひとつで、ページぜんたいの振る舞いを変える。",
];

// 題材 — 行き詰まったときに投げ込む、ひとつの言葉
const THEMES = [
  "水", "窓", "沈黙", "別れ", "名前", "影", "約束", "余白", "雨", "鏡",
  "朝", "夜明け", "忘却", "手紙", "距離", "声", "傷", "呼吸", "境界", "残響",
  "未完", "反復", "気配", "対称", "欠落", "二重", "逆さ", "蛇行", "結び目", "余韻",
];

