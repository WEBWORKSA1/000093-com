/* 000093.com — interactive tools: Code Decoder, Lucky Number Analyzer, Quiz */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var ZH = "零一二三四五六七八九", PY = ["líng", "yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ"];

  /* =========================================================
     1) SECURITIES CODE DECODER
     ========================================================= */
  var KNOWN = {
    "000001": "Shared number: SZSE-listed bank stock AND the SSE Composite Index (market context decides which).",
    "000300": "CSI 300 Index (SSE-side code; the SZSE-side mirror code is 399300).",
    "000016": "SSE 50 Index (Shanghai-side index code).",
    "000905": "CSI 500 Index (Shanghai-side index code).",
    "000852": "CSI 1000 Index (Shanghai-side index code).",
    "000688": "SSE STAR 50 Index (Shanghai-side index code).",
    "399001": "SZSE Component Index.",
    "399006": "ChiNext Index.",
    "000093": "Namespace shared by the Shenzhen Main Board stock range, the Shanghai index-code range and the off-exchange mutual-fund code range. It has been used for a tiered bond-fund share class (launched 2013). In Hong Kong, 00093 is a Main Board listed company. Always confirm the market before trading.",
    "00700": "Hong Kong Main Board — one of the largest HK-listed internet platform companies.",
    "600519": "Shanghai Main Board — a top-weighted consumer staples (baijiu) stock.",
    "300750": "ChiNext — a leading battery-maker by market value."
  };
  var EX = {
    sse: { name: "Shanghai Stock Exchange (SSE)", url: "https://www.sse.com.cn/" },
    szse: { name: "Shenzhen Stock Exchange (SZSE)", url: "https://www.szse.cn/" },
    bse: { name: "Beijing Stock Exchange (BSE)", url: "https://www.bse.cn/" },
    hkex: { name: "Hong Kong Exchanges (HKEX)", url: "https://www.hkexnews.hk/" }
  };
  function rule(code) {
    var p3 = code.slice(0, 3), p2 = code.slice(0, 2);
    var R = function (ex, board, cur, limit, access, connect, note, type) { return { ex: ex, board: board, cur: cur, limit: limit, access: access, connect: connect, note: note, type: type || "A-share equity" }; };
    if (/^68[89]/.test(code)) return R("sse", "STAR Market (科创板)", "CNY", "±20% (no limit first 5 days after IPO)", "Retail: ≥ CNY 500k assets + 24 months trading experience", "Eligible names via Northbound Stock Connect (index constituents)", "Tech & hard-science board with registration-based IPOs.");
    if (/^60[0135]/.test(code)) return R("sse", "Main Board (主板)", "CNY", "±10% (±5% for ST / *ST names)", "Open to all mainland retail accounts", "Large/mid caps commonly eligible Northbound", "Shanghai's blue-chip board — banks, energy, consumer giants.");
    if (p3 === "900") return R("sse", "B-share (B股)", "USD", "±10%", "Open to foreign & domestic holders of FX accounts", "Not in Stock Connect", "Legacy foreign-currency share class.", "B-share equity");
    if (/^00[0-4]/.test(code)) {
      var n = R("szse", "Main Board (主板)", "CNY", "±10% (±5% for ST / *ST names)", "Open to all mainland retail accounts", "Large/mid caps commonly eligible Northbound", p3 === "002" || p3 === "003" ? "Former SME Board range — merged into the Main Board in 2021." : "Shenzhen's original Main Board range.");
      if (p3 === "000") { n.shared = true; n.note += " The 000xxx number space is also used for Shanghai-side index codes and many off-exchange mutual-fund codes — the same six digits can mean different things in different systems."; }
      return n;
    }
    if (/^30[0-2]/.test(code)) return R("szse", "ChiNext (创业板)", "CNY", "±20% (no limit first 5 days after IPO)", "Retail: ≥ CNY 100k assets + 24 months trading experience", "Eligible names via Northbound Stock Connect", "Growth & innovation board, registration-based IPOs since 2020.");
    if (p3 === "200") return R("szse", "B-share (B股)", "HKD", "±10%", "Open to foreign & domestic holders of FX accounts", "Not in Stock Connect", "Legacy foreign-currency share class.", "B-share equity");
    if (p3 === "399") return R("szse", "Index (指数)", "—", "n/a", "Benchmark — not directly tradable", "Tracked by ETFs", "Shenzhen-side index code.", "Index");
    if (p3 === "920" || p3 === "430" || /^8[3-9]/.test(code)) return R("bse", "Beijing Stock Exchange (北交所)", "CNY", "±30% (no limit on IPO day)", "Retail: ≥ CNY 500k assets + 24 months experience", "Not in Stock Connect", "SME-focused exchange opened 2021; new listings now use the 920 prefix.");
    if (/^(51|52|53|56|58)/.test(code)) return R("sse", "ETF (交易型基金)", "CNY", "±10% (±20% for STAR/ChiNext ETFs)", "Open to all", "Selected ETFs in ETF Connect", "Exchange-traded fund listed in Shanghai.", "ETF");
    if (/^50/.test(code)) return R("sse", "Listed fund (LOF / closed-end)", "CNY", "±10%", "Open to all", "—", "Shanghai-listed fund.", "Fund");
    if (/^1[56]/.test(code)) return R("szse", "ETF / LOF (基金)", "CNY", "±10% (±20% for growth-board ETFs)", "Open to all", "Selected ETFs in ETF Connect", "Fund listed in Shenzhen.", "ETF / fund");
    if (/^11/.test(code)) return R("sse", "Bonds & convertibles (债券)", "CNY", "Convertibles: ±20%", "Convertibles require suitability checks", "—", "Shanghai bond / convertible code range (110/111/113/118 = convertibles).", "Bond");
    if (/^12/.test(code)) return R("szse", "Bonds & convertibles (债券)", "CNY", "Convertibles: ±20%", "Convertibles require suitability checks", "—", "Shenzhen bond / convertible code range (123/127/128 = convertibles).", "Bond");
    if (p3 === "204") return R("sse", "Treasury repo (国债逆回购)", "CNY", "n/a", "Open to all", "—", "Short-term reverse repo — popular cash parking tool.", "Repo");
    if (p3 === "131") return R("szse", "Treasury repo (国债逆回购)", "CNY", "n/a", "Open to all", "—", "Short-term reverse repo.", "Repo");
    return R("—", "Unassigned / other", "—", "—", "—", "—", "This prefix isn't a mainstream exchange range. It may be an off-exchange mutual-fund code, a bank wealth product, or unassigned.", "Unknown");
  }
  function hk(code) {
    var n = parseInt(code, 10), c5 = String(n).padStart(5, "0");
    var r = { ex: "hkex", cur: "HKD", limit: "No daily price limit (volatility-control mechanism applies)", access: "Open to all brokerage accounts", connect: "Large/mid caps often eligible Southbound", code: c5, type: "HK equity" };
    if ((n >= 2800 && n <= 2849) || (n >= 3000 && n <= 3199) || (n >= 9000 && n <= 9199) || (n >= 9800 && n <= 9849)) { r.board = "ETF range"; r.type = "ETF"; r.note = "Exchange-traded fund range (some are USD/RMB counters)."; }
    else if (n >= 8000 && n <= 8999) { r.board = "GEM (創業板)"; r.note = "Growth Enterprise Market — smaller companies, higher risk."; }
    else if (n >= 10000 && n <= 29999) { r.board = "Derivative warrants"; r.type = "Structured product"; r.limit = "Leveraged — can expire worthless"; r.note = "Issued by banks; high risk."; }
    else if (n >= 50000 && n <= 69999) { r.board = "CBBCs (牛熊證)"; r.type = "Structured product"; r.limit = "Knock-out feature"; r.note = "Callable bull/bear contracts."; }
    else if (n >= 80000 && n <= 89999) { r.board = "RMB counter"; r.cur = "CNY"; r.note = "Renminbi-traded counter of a dual-counter security."; }
    else if (n >= 1 && n <= 7999) { r.board = "Main Board (主板)"; r.note = "Main Board securities — equities, REITs and other listed instruments."; }
    else { r.board = "Other / unassigned"; r.type = "Unknown"; r.note = "Outside the mainstream HKEX ranges."; }
    return r;
  }
  function decode(raw) {
    var code = String(raw).replace(/\D/g, "");
    if (!code) return null;
    var out;
    if (code.length === 6) { out = rule(code); out.code = code; out.market = "Mainland China (A-share system)"; }
    else if (code.length <= 5) { out = hk(code); out.market = "Hong Kong"; code = out.code; }
    else return { error: "Codes are 6 digits (mainland) or up to 5 digits (Hong Kong). Try 600519, 000093 or 00700." };
    out.known = KNOWN[code] || (code.length === 5 && KNOWN[code]) || null;
    return out;
  }
  function renderDecode(res, box) {
    if (!res) return;
    if (res.error) { box.innerHTML = '<p class="form-status err">' + esc(res.error) + "</p>"; box.classList.add("show"); return; }
    var ex = EX[res.ex] || { name: "—", url: "#" };
    var spoken = res.code.split("").map(function (d) { return ZH[+d]; }).join(""), py = res.code.split("").map(function (d) { return PY[+d]; }).join(" ");
    box.innerHTML =
      '<div class="score-top"><div><span class="tag red">' + esc(res.type) + '</span><h2 class="num" style="margin:8px 0 2px">' + esc(res.code) + '</h2><div class="zh">' + spoken + ' <span class="muted">· ' + py + "</span></div></div></div>" +
      '<div class="kv">' +
      "<div><b>Market</b><span>" + esc(res.market) + "</span></div>" +
      "<div><b>Exchange</b><span>" + esc(ex.name) + "</span></div>" +
      "<div><b>Board</b><span>" + esc(res.board) + "</span></div>" +
      "<div><b>Currency</b><span>" + esc(res.cur) + "</span></div>" +
      "<div><b>Daily price limit</b><span>" + esc(res.limit) + "</span></div>" +
      "<div><b>Investor access</b><span>" + esc(res.access) + "</span></div>" +
      "<div><b>Stock Connect</b><span>" + esc(res.connect) + "</span></div>" +
      "</div>" +
      '<p>' + esc(res.note) + "</p>" +
      (res.known ? '<div class="callout"><b>About this number:</b> ' + esc(res.known) + "</div>" : "") +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">' +
      (res.ex !== "—" ? '<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="' + ex.url + '">Verify on exchange ↗</a>' : "") +
      '<a class="btn btn-ghost btn-sm" href="lucky-numbers.html?q=' + res.code + '">Lucky-number reading →</a>' +
      '<button class="btn btn-ghost btn-sm" data-share-inline>Share result</button>' +
      '<a class="btn btn-primary btn-sm" href="services.html?service=research">Get a research brief</a></div>' +
      '<p class="form-note">Rule-based decoding for education only. Code ranges change; always confirm on the official exchange site. Not investment advice.</p>';
    box.classList.add("show");
    var sh = box.querySelector("[data-share-inline]");
    if (sh) sh.addEventListener("click", function () { var u = location.origin + location.pathname + "?q=" + res.code; if (navigator.share) navigator.share({ title: "Code " + res.code + " decoded", url: u }).catch(function () {}); else { navigator.clipboard && navigator.clipboard.writeText(u); sh.textContent = "Link copied ✓"; } });
    if (window.track) window.track("tool_decode", { code: res.code });
    try { history.replaceState(null, "", "?q=" + res.code); } catch (e) {}
  }
  var df = $("#decoder-form");
  if (df) {
    var dbox = $("#decoder-result");
    df.addEventListener("submit", function (e) { e.preventDefault(); renderDecode(decode(df.code.value), dbox); });
    var q0 = new URLSearchParams(location.search).get("q");
    df.code.value = q0 || "000093"; renderDecode(decode(df.code.value), dbox);
  }

  /* =========================================================
     2) LUCKY NUMBER ANALYZER  (cultural entertainment)
     ========================================================= */
  var DIG = {
    0: { w: 1, m: "零 líng — wholeness, a clean start; neutral-positive", cls: "" },
    1: { w: 1, m: "一 yī / 幺 yāo — unity, 'number one', single-minded", cls: "" },
    2: { w: 2, m: "二 èr — pairs & harmony: 好事成双 'good things come in pairs'", cls: "good" },
    3: { w: 1, m: "三 sān — sounds like 生 'life/growth' (but also 散 'scatter')", cls: "" },
    4: { w: -7, m: "四 sì — sounds like 死 'death'; widely avoided", cls: "bad" },
    5: { w: 0, m: "五 wǔ — 'me' (我) or 'none' (无); context-dependent", cls: "" },
    6: { w: 4, m: "六 liù — smooth flow: 六六大顺 'everything goes smoothly'", cls: "good" },
    7: { w: 0, m: "七 qī — 'rise' (起) or 'together'; mixed", cls: "" },
    8: { w: 6, m: "八 bā — sounds like 发 'prosper'; the luckiest digit", cls: "good" },
    9: { w: 4, m: "九 jiǔ — sounds like 久 'long-lasting'; longevity", cls: "good" }
  };
  var PAT = [
    ["5201314", 10, "我爱你一生一世 — 'I love you for a lifetime'", "h"],
    ["1314", 6, "一生一世 — 'for a whole lifetime'", "l"],
    ["520", 5, "我爱你 — 'I love you' (May 20 is 'Love Day')", "h"],
    ["168", 8, "一路发 — 'prosperity all the way'", "w"],
    ["518", 8, "我要发 — 'I will prosper'", "w"],
    ["918", 5, "就要发 — 'about to prosper'", "w"],
    ["888", 10, "发发发 — triple prosperity", "w"],
    ["666", 8, "六六六 — 'smooth / awesome' (internet slang: skilled)", "h"],
    ["999", 8, "久久久 — everlasting", "l"],
    ["88", 4, "发发 — double prosperity / 'bye-bye' in chat", "w"],
    ["66", 3, "六六 — smooth sailing", "h"],
    ["99", 3, "久久 — long-lasting", "l"],
    ["58", 3, "我发 — 'I prosper'", "w"],
    ["93", 3, "九三 — Sept 3 Victory Day; also 久生 'lasting life'", "l"],
    ["0000", 2, "四个零 — a perfectly clean slate", "m"],
    ["250", -6, "二百五 — slang for 'fool'", "x"],
    ["14", -6, "要死 — sounds like 'going to die'", "x"],
    ["74", -5, "气死 — 'furious to death'", "x"],
    ["44", -6, "死死 — double 'death'", "x"],
    ["38", -2, "三八 — can be an insult (context)", "x"]
  ];
  function analyze(raw, mode) {
    var d = String(raw).replace(/\D/g, "");
    if (!d) return null;
    var score = 50, W = 40, L = 40, H = 40, M = 40, found = [];
    d.split("").forEach(function (c) { var x = DIG[c]; score += x.w * (6 / Math.max(6, d.length)); if (c === "8" || c === "6") W += 8; if (c === "9") L += 10; if (c === "2" || c === "6") H += 7; if (c === "4") { W -= 6; L -= 8; H -= 6; } });
    var used = d;
    PAT.forEach(function (p) {
      if (used.indexOf(p[0]) > -1) {
        found.push(p); score += p[1];
        if (p[3] === "w") W += p[1] * 3; if (p[3] === "l") L += p[1] * 3; if (p[3] === "h") H += p[1] * 3; if (p[3] === "x") { W -= 8; H -= 10; }
        if (p[0].length >= 3) used = used.split(p[0]).join("_");
      }
    });
    var runs = d.match(/(\d)\1{2,}/g) || [], asc = /(0123|1234|2345|3456|4567|5678|6789)/.test(d), uniq = new Set(d.split("")).size;
    M += runs.length * 18 + (asc ? 15 : 0) + Math.max(0, (6 - uniq) * 8) + (d.length <= 6 ? 12 : 0);
    if (/^(\d\d)\1+$/.test(d) || /^(\d)(\d)\2\1$/.test(d)) { M += 15; found.push([d, 0, "Pattern: repeating / mirror (ABAB, ABBA) — highly memorable", "m"]); }
    if (runs.length) found.push([runs.join(", "), 0, "Repeated-digit run — premium 'leopard' (豹子号) style pattern", "m"]);
    var clamp = function (x) { return Math.max(3, Math.min(99, Math.round(x))); };
    return { d: d, score: clamp(score + (M - 40) / 6), W: clamp(W), L: clamp(L), H: clamp(H), M: clamp(M), found: found, has4: d.indexOf("4") > -1, mode: mode };
  }
  function modeNote(r) {
    var d = r.d;
    if (r.mode === "domain") {
      var cat = d.length + "N" + (d.length <= 4 ? " (ultra-scarce: only " + Math.pow(10, d.length).toLocaleString() + " possible .com)" : " (" + Math.pow(10, d.length).toLocaleString() + " possible .com)");
      var chip = !/[04]/.test(d) ? "Yes — no 0 or 4 ('CHIP' premium)" : "No — contains 0 and/or 4 (Chinese buyers pay less)";
      var lead0 = d[0] === "0" ? "Leading zero: reads like a stock/fund code — strong fit for finance & data brands." : "";
      return "<b>Numeric domain:</b> " + cat + ". CHIP-grade: " + chip + ". " + lead0;
    }
    if (r.mode === "phone") return "<b>Phone reading tip:</b> Chinese speakers read 1 as 幺 (yāo) in phone numbers to avoid confusion with 7. Endings in 8/6/9 are prized; 4 is avoided in the last 4 digits.";
    if (r.mode === "plate") return "<b>Plate tip:</b> Special plates are auctioned in Hong Kong & Macau and allotted by lottery in many mainland cities; 8-heavy plates attract the highest bids.";
    if (r.mode === "date") {
      var y = parseInt(d.slice(0, 4), 10);
      if (y > 1900 && y < 2200) { var a = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"][(((y - 4) % 12) + 12) % 12]; return "<b>Zodiac:</b> " + y + " is broadly the Year of the " + a + " (dates before Lunar New Year belong to the previous animal)."; }
      return "<b>Date tip:</b> enter as YYYYMMDD, e.g. 20260903.";
    }
    return "";
  }
  function renderLucky(r, box) {
    if (!r) { box.innerHTML = '<p class="form-status err">Enter some digits.</p>'; box.classList.add("show"); return; }
    var verdict = r.score >= 80 ? "Highly auspicious 大吉" : r.score >= 62 ? "Auspicious 吉" : r.score >= 45 ? "Neutral 平" : "Unlucky-leaning 凶";
    var cells = r.d.split("").slice(0, 24).map(function (c) { var x = DIG[c]; return '<div class="dcell ' + x.cls + '" title="' + esc(x.m) + '"><b>' + c + '</b><span class="zh">' + (r.mode === "phone" && c === "1" ? "幺" : ZH[+c]) + "</span><small>" + (r.mode === "phone" && c === "1" ? "yāo" : PY[+c]) + "</small></div>"; }).join("");
    var bar = function (l, v) { return '<div class="bar"><div style="display:flex;justify-content:space-between;font-size:.88rem"><span>' + l + '</span><b class="num">' + v + '</b></div><div class="track"><div class="fill" style="width:' + v + '%"></div></div></div>'; };
    var seen = {}, meanings = r.d.split("").filter(function (c) { if (seen[c]) return false; seen[c] = 1; return true; }).map(function (c) { return "<li><b class='num'>" + c + "</b> — " + esc(DIG[c].m) + "</li>"; }).join("");
    box.innerHTML =
      '<div class="score-top"><div class="score-ring" style="--p:' + r.score + '"><div><div><b>' + r.score + '</b><br><small class="muted">/ 100</small></div></div></div>' +
      '<div><span class="tag gold">' + verdict + '</span><h2 class="num" style="margin:8px 0 4px">' + esc(r.d) + "</h2><p class='muted' style='margin:0'>" + (r.has4 ? "Contains 4 — a popular dealbreaker." : "No 4 — clean by traditional standards.") + "</p></div></div>" +
      '<div class="digit-row">' + cells + "</div>" +
      '<div class="grid g2"><div class="bars">' + bar("Wealth 财", r.W) + bar("Longevity 寿", r.L) + bar("Harmony 和", r.H) + bar("Memorability 记", r.M) + "</div>" +
      "<div><h3>Patterns found</h3>" + (r.found.length ? "<ul>" + r.found.map(function (p) { return "<li><b class='num'>" + esc(p[0]) + "</b> — " + esc(p[2]) + "</li>"; }).join("") + "</ul>" : "<p class='muted'>No classic combos — meaning comes from individual digits.</p>") + "</div></div>" +
      "<h3 style='margin-top:12px'>Digit meanings</h3><ul>" + meanings + "</ul>" +
      (modeNote(r) ? '<div class="callout">' + modeNote(r) + "</div>" : "") +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px"><a class="btn btn-ghost btn-sm" href="decoder.html?q=' + r.d.slice(0, 6) + '">Decode as a stock code →</a><a class="btn btn-primary btn-sm" href="services.html?service=domains">Buy / sell a lucky number or domain</a></div>' +
      '<p class="form-note">For cultural entertainment and education only. Numerology has no proven effect on outcomes.</p>';
    box.classList.add("show");
    if (window.track) window.track("tool_lucky", { mode: r.mode });
  }
  var lf = $("#lucky-form");
  if (lf) {
    var lbox = $("#lucky-result"), mode = "general";
    Array.prototype.forEach.call(document.querySelectorAll("[data-mode]"), function (b) {
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("[data-mode]"), function (x) { x.setAttribute("aria-selected", "false"); });
        b.setAttribute("aria-selected", "true"); mode = b.getAttribute("data-mode");
        lf.num.placeholder = b.getAttribute("data-ph"); if (lf.num.value) renderLucky(analyze(lf.num.value, mode), lbox);
      });
    });
    lf.addEventListener("submit", function (e) { e.preventDefault(); renderLucky(analyze(lf.num.value, mode), lbox); });
    var q = new URLSearchParams(location.search).get("q");
    lf.num.value = q || "000093"; if (q && q.length === 6) { mode = "general"; }
    renderLucky(analyze(lf.num.value, mode), lbox);
  }

  /* =========================================================
     3) NUMBER QUIZ
     ========================================================= */
  var QZ = [
    ["In Chinese chat, what does 520 mean?", ["I love you", "Goodbye", "Get rich", "Happy birthday"], 0],
    ["Why is 8 considered lucky?", ["It sounds like 'prosper' (发)", "It looks like a dragon", "It's the emperor's number", "It rhymes with 'rice'"], 0],
    ["A 6-digit code starting with 688 is listed on…", ["Shanghai STAR Market", "Shenzhen ChiNext", "Hong Kong GEM", "Beijing Stock Exchange"], 0],
    ["What historic date does 九三 (9·3) commemorate in China?", ["Victory in the War of Resistance, 3 Sept 1945", "Founding of the PRC", "Lunar New Year", "Mid-Autumn Festival"], 0],
    ["Daily price limit on ChiNext and STAR Market stocks?", ["±20%", "±10%", "±5%", "None"], 0],
    ["How do Chinese speakers usually say '1' in a phone number?", ["幺 yāo", "一 yī", "壹 yī", "单 dān"], 0],
    ["Which digit is most often avoided?", ["4", "7", "0", "3"], 0],
    ["What does 1314 suggest?", ["For a whole lifetime", "Bad luck", "Money", "A holiday"], 0]
  ];
  var qb = $("#quiz");
  if (qb) {
    var i = 0, pts = 0;
    function shuffle(a) { return a.map(function (x) { return [Math.random(), x]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; }); }
    function show() {
      if (i >= QZ.length) { qb.innerHTML = '<div class="quiz-q">You scored ' + pts + " / " + QZ.length + " " + (pts >= 7 ? "— 大师 Master!" : pts >= 5 ? "— 不错 Nice!" : "— keep decoding!") + '</div><button class="btn btn-primary" id="qz-again">Play again</button> <a class="btn btn-ghost" href="contests.html">Enter the contest →</a>'; $("#qz-again").onclick = function () { i = 0; pts = 0; show(); }; if (window.track) window.track("quiz_done", { score: pts }); return; }
      var q = QZ[i], right = q[1][q[2]], opts = shuffle(q[1].slice());
      qb.innerHTML = '<div class="muted num">Q' + (i + 1) + " / " + QZ.length + '</div><div class="quiz-q">' + esc(q[0]) + '</div><div class="quiz-opts">' + opts.map(function (o) { return "<button>" + esc(o) + "</button>"; }).join("") + "</div>";
      Array.prototype.forEach.call(qb.querySelectorAll(".quiz-opts button"), function (b) {
        b.onclick = function () {
          var ok = b.textContent === right; if (ok) pts++;
          Array.prototype.forEach.call(qb.querySelectorAll(".quiz-opts button"), function (x) { x.disabled = true; if (x.textContent === right) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          setTimeout(function () { i++; show(); }, 900);
        };
      });
    }
    show();
  }
})();
