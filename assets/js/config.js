/* ============================================================
   000093.com — SITE CONFIG  (edit this file only to go live)
   ============================================================ */
window.SITE = {
  name: "000093",
  tagline: "Decode China's numbers. Markets, codes & culture.",
  interestUrl: "https://web.works/contact",

  /* Google AdSense — paste your publisher id (e.g. "ca-pub-1234567890123456").
     Leave "" to show house ads. Also update /ads.txt. */
  adsenseClient: "",
  adSlots: { leaderboard: "", inArticle: "", sidebar: "", footer: "" },

  /* Google Analytics 4 measurement id (e.g. "G-XXXXXXX"). Optional. */
  ga4: "",

  /* Donation / payment links. Any left "" hides that button and the
     pledge form (which routes to the private inbox) is used instead. */
  pay: { paypal: "", kofi: "", buymeacoffee: "", stripe: "", githubSponsors: "" },
  fundraising: { goal: 5000, raised: 0, currency: "USD", label: "Year-1 operations & creator fund" },
  supporters: [ /* { name:"Your name", note:"Keep decoding!", amount:"$10" } */ ],

  /* YouTube — add video IDs from your channel; the hub renders them as fast-loading embeds. */
  youtubeChannel: "",
  videos: [ /* { id:"VIDEO_ID", title:"How to read a Shanghai stock code", tag:"Markets" } */ ],

  /* Contest */
  contest: { title: "The Lucky Number Story Contest", deadline: "2026-12-31T23:59:59+08:00" }
};
/* Contact routing key (obfuscated; never rendered in the page). */
window.__k = [122,120,116,57,123,126,118,122,112,87,38,118,100,124,101,120,96,117,114,96];
