/* 000093.com — core UI */
(function () {
  "use strict";
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  function inbox() { return (window.__k || []).slice().reverse().map(function (c) { return String.fromCharCode(c ^ 23); }).join(""); }
  window.__inbox = inbox;

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var saved = store.get("theme");
  if (saved) root.setAttribute("data-theme", saved);
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next); store.set("theme", next);
    });
  });

  /* ---------- language (EN / 中文 for UI labels) ---------- */
  function applyLang(l) {
    $$("[data-zh]").forEach(function (el) {
      if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.textContent);
      el.textContent = l === "zh" ? el.getAttribute("data-zh") : el.getAttribute("data-en");
    });
    root.setAttribute("lang", l === "zh" ? "zh-Hans" : "en");
    $$("[data-lang-toggle]").forEach(function (b) { b.textContent = l === "zh" ? "EN" : "中文"; });
  }
  var lang = store.get("lang") || "en";
  if (lang === "zh") applyLang("zh");
  $$("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { lang = lang === "zh" ? "en" : "zh"; store.set("lang", lang); applyLang(lang); });
  });

  /* ---------- active nav ---------- */
  var here = location.pathname.replace(/\/$/, "/index.html");
  $$(".menu a").forEach(function (a) {
    var p = new URL(a.href, location.href).pathname;
    var sec = p.replace(/index\.html$/, "");
    if (p === here || (sec.length > 1 && /\/insights\/$/.test(sec) && here.indexOf(sec) === 0)) a.setAttribute("aria-current", "page");
  });

  /* ---------- mobile menu ---------- */
  var burger = $(".burger"), menu = $(".menu");
  if (burger && menu) burger.addEventListener("click", function () {
    var o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o ? "true" : "false");
  });

  /* ---------- hidden email links ---------- */
  $$("[data-mail]").forEach(function (a) {
    a.setAttribute("href", "#contact");
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var subj = a.getAttribute("data-subject") || "Inquiry via 000093.com";
      window.location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent(subj);
    });
  });

  /* ---------- forms (all routed privately) ---------- */
  function serialize(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === "_honey") return;
      data[k] = data[k] ? data[k] + ", " + v : v;
    });
    return data;
  }
  function mailFallback(data) {
    var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
    window.location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent(data._subject || "000093.com form") + "&body=" + encodeURIComponent(body);
  }
  $$("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = $(".form-status", form);
      if (form._honey && form._honey.value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = serialize(form);
      data._subject = "[000093.com] " + (form.getAttribute("data-form") || "Form") + (data.name ? " — " + data.name : "");
      data._template = "table";
      data.page = location.href;
      data.submitted = new Date().toISOString();
      var btn = $("button[type=submit]", form); if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = "Sending…"; }
      fetch("https://formsubmit.co/ajax/" + inbox(), {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (j && (j.success === true || j.success === "true")) {
          if (status) { status.className = "form-status ok"; status.textContent = form.getAttribute("data-ok") || "Thank you — received. We reply within 1–2 business days."; }
          form.reset(); track("generate_lead", { form: form.getAttribute("data-form") });
          var steps = $$(".step", form); if (steps.length) showStep(form, 0);
        } else { throw new Error("fail"); }
      }).catch(function () {
        if (status) { status.className = "form-status err"; status.textContent = "Opening your email app to finish sending…"; }
        mailFallback(data);
      }).finally(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t; } });
    });
  });

  /* ---------- multi-step forms ---------- */
  function showStep(form, i) {
    var steps = $$(".step", form), dots = $$(".steps span", form);
    steps.forEach(function (s, n) { s.classList.toggle("active", n === i); });
    dots.forEach(function (d, n) { d.classList.toggle("on", n <= i); });
    form.dataset.step = i;
  }
  $$("form[data-multistep]").forEach(function (form) {
    showStep(form, 0);
    $$("[data-next]", form).forEach(function (b) {
      b.addEventListener("click", function () {
        var i = +form.dataset.step, cur = $$(".step", form)[i];
        var bad = $$("input,select,textarea", cur).filter(function (x) { return !x.checkValidity(); });
        if (bad.length) { bad[0].reportValidity(); return; }
        showStep(form, i + 1);
      });
    });
    $$("[data-prev]", form).forEach(function (b) { b.addEventListener("click", function () { showStep(form, +form.dataset.step - 1); }); });
  });
  // preselect service from URL (?service=...)
  var qs = new URLSearchParams(location.search);
  if (qs.get("service")) { var r = $('input[name="service"][value="' + qs.get("service") + '"]'); if (r) r.checked = true; }

  /* ---------- universal search (codes & numbers) ---------- */
  $$("form[data-search]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = (f.q.value || "").trim(); if (!v) return;
      var base = f.getAttribute("data-root") || "";
      var digits = v.replace(/\D/g, "");
      var isCode = /^\d{4,6}$/.test(v.replace(/\s/g, ""));
      location.href = base + (isCode ? "decoder.html" : "lucky-numbers.html") + "?q=" + encodeURIComponent(digits || v);
    });
  });
  $$("[data-chip]").forEach(function (c) {
    c.addEventListener("click", function () {
      var f = c.closest("[data-chip-target]"); var t = f ? $(f.getAttribute("data-chip-target")) : null;
      if (t) { t.value = c.getAttribute("data-chip"); var form = t.form; if (form) form.requestSubmit ? form.requestSubmit() : form.submit(); }
    });
  });

  /* ---------- ads ---------- */
  function initAds() {
    var slots = $$(".ad-slot");
    if (S.adsenseClient && store.get("consent") !== "no") {
      var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + S.adsenseClient;
      document.head.appendChild(s);
      slots.forEach(function (el) {
        var key = el.getAttribute("data-slot") || "leaderboard";
        el.classList.add("live");
        el.innerHTML = '<span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block;width:100%" data-ad-client="' + S.adsenseClient + '"' +
          (S.adSlots && S.adSlots[key] ? ' data-ad-slot="' + S.adSlots[key] + '"' : "") + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      });
    } else {
      var root = document.body.getAttribute("data-root") || "";
      var house = [
        ["Advertise to China-curious investors & founders", "partner.html", "Get the media kit"],
        ["Planning a China market move? Free 20-min consult", "services.html", "Book now"],
        ["Keep this site free — become a supporter", "support.html", "Support"],
        ["Win prizes: Lucky Number Story Contest", "contests.html", "Enter"]
      ];
      slots.forEach(function (el, i) {
        var h = house[i % house.length];
        el.innerHTML = '<span class="ad-label">Sponsored · House</span><div class="house-ad"><span>' + h[0] + '</span><a class="btn btn-sm btn-gold" href="' + root + h[1] + '">' + h[2] + '</a></div>';
      });
    }
  }

  /* ---------- analytics ---------- */
  function track(name, params) { if (window.gtag) window.gtag("event", name, params || {}); }
  window.track = track;
  function initGA() {
    if (!S.ga4 || store.get("consent") === "no") return;
    var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + S.ga4; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", S.ga4);
  }

  /* ---------- cookie consent ---------- */
  var ck = $(".cookie");
  if (ck && !store.get("consent")) ck.classList.add("show");
  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () { store.set("consent", b.getAttribute("data-consent")); ck.classList.remove("show"); initGA(); });
  });
  initAds(); initGA();

  /* ---------- video facades ---------- */
  function bindVideo(v) {
    v.addEventListener("click", function () {
      var id = v.getAttribute("data-yt");
      v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="Video" allow="accelerometer;autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>';
      track("video_play", { id: id });
    });
  }
  var vh = $("#video-grid");
  if (vh && S.videos && S.videos.length) {
    vh.innerHTML = S.videos.map(function (v) {
      return '<div class="card"><div class="video" data-yt="' + v.id + '" role="button" tabindex="0" aria-label="Play ' + v.title + '"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg"><div class="play"><span>▶</span></div></div><h3 style="margin-top:12px">' + v.title + '</h3><span class="tag red">' + (v.tag || "Video") + '</span></div>';
    }).join("");
  }
  $$("[data-yt]").forEach(bindVideo);
  if (S.youtubeChannel) $$("[data-yt-channel]").forEach(function (a) { a.href = S.youtubeChannel; });

  /* ---------- donations ---------- */
  var dz = $("#donate");
  if (dz) {
    var amt = 25, freq = "one-time";
    var out = $("#donate-summary");
    function sum() { if (out) out.textContent = "$" + amt + (freq === "monthly" ? " / month" : " one-time"); var h = $("#pledge-amount"); if (h) h.value = "$" + amt + " " + freq; }
    $$(".amt", dz).forEach(function (b) {
      b.addEventListener("click", function () { $$(".amt", dz).forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); amt = +b.dataset.v; var c = $("#custom-amt"); if (c) c.value = ""; sum(); });
    });
    var c = $("#custom-amt"); if (c) c.addEventListener("input", function () { if (+c.value > 0) { amt = +c.value; $$(".amt", dz).forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); sum(); } });
    $$(".toggle button", dz).forEach(function (b) {
      b.addEventListener("click", function () { $$(".toggle button", dz).forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); freq = b.dataset.f; sum(); });
    });
    sum();
    var P = S.pay || {}, links = $("#pay-links"), any = false;
    var labels = { paypal: "PayPal", kofi: "Ko-fi", buymeacoffee: "Buy Me a Coffee", stripe: "Card (Stripe)", githubSponsors: "GitHub Sponsors" };
    Object.keys(labels).forEach(function (k) {
      if (P[k]) { any = true; links.insertAdjacentHTML("beforeend", '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + P[k] + '">' + labels[k] + '</a>'); }
    });
    if (!any && links) links.innerHTML = '<p class="muted" style="margin:0">Secure card & PayPal checkout is being connected. Use the pledge form below — we reply with a private payment link within 24h.</p>';
  }
  var F = S.fundraising;
  if (F && $("#fund-bar")) {
    var pct = Math.min(100, Math.round((F.raised / F.goal) * 100));
    $("#fund-bar").style.width = Math.max(pct, 2) + "%";
    $("#fund-text").textContent = "$" + F.raised.toLocaleString() + " raised of $" + F.goal.toLocaleString() + " goal · " + F.label;
  }
  var wall = $("#supporter-wall");
  if (wall) wall.innerHTML = (S.supporters && S.supporters.length) ? S.supporters.map(function (s) { return '<div class="sup"><b>' + s.name + '</b> ' + (s.amount || "") + '<br><span class="muted">' + (s.note || "") + '</span></div>'; }).join("") : '<div class="sup">Be the first name on the wall ✦</div>';

  /* ---------- countdowns ---------- */
  $$("[data-countdown]").forEach(function (el) {
    var end = new Date(el.getAttribute("data-countdown")).getTime();
    function tick() {
      var d = Math.max(0, end - Date.now());
      var parts = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
      el.innerHTML = ["Days", "Hrs", "Min", "Sec"].map(function (l, i) { return '<div><b>' + String(parts[i]).padStart(2, "0") + '</b><small>' + l + '</small></div>'; }).join("");
    }
    tick(); setInterval(tick, 1000);
  });

  /* ---------- job filters ---------- */
  var jf = $("#job-filter");
  if (jf) jf.addEventListener("change", function () {
    var v = jf.value; $$(".job-card").forEach(function (j) { j.style.display = (!v || j.dataset.type === v) ? "" : "none"; });
  });
  $$("[data-apply]").forEach(function (b) {
    b.addEventListener("click", function () { var s = $("#role"); if (s) s.value = b.getAttribute("data-apply"); });
  });

  /* ---------- tabs ---------- */
  $$("[data-tabs]").forEach(function (wrap) {
    var tabs = $$(".tab", wrap);
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.setAttribute("aria-selected", "false"); });
        t.setAttribute("aria-selected", "true");
        var scope = wrap.parentElement;
        $$(".panel", scope).forEach(function (p) { p.classList.toggle("active", p.id === t.getAttribute("aria-controls")); });
      });
    });
  });

  /* ---------- share ---------- */
  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var d = { title: document.title, url: location.href };
      if (navigator.share) navigator.share(d).catch(function () {});
      else { navigator.clipboard && navigator.clipboard.writeText(location.href); b.textContent = "Link copied ✓"; }
    });
  });

  /* ---------- reveal / to-top / sticky CTA ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .08 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  var tt = $(".to-top"), sc = $(".sticky-cta");
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (tt) tt.classList.toggle("show", y > 700);
    if (sc && !store.get("sc-x")) sc.classList.toggle("show", y > 900);
  }, { passive: true });
  if (tt) tt.addEventListener("click", function () { window.scrollTo({ top: 0 }); });
  $$("[data-sc-close]").forEach(function (b) { b.addEventListener("click", function () { store.set("sc-x", "1"); sc.classList.remove("show"); }); });

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
