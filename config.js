/*
  RealmTag site configuration
  ---------------------------
  Everything you need to change is in this file.
  The Discord webhook below receives ratings, creator applications and staff applications.
*/
window.REALMTAG_CONFIG = {
  // One webhook for all three forms. Replace this if the webhook ever changes.
  webhookUrl:
    "https://discord.com/api/webhooks/1569050518943305761/acN-lcOrIJ60Yb2ocY7MPoKhBff-5XH2s899GO2sj6OwCVguRNfWkdGMeTWz5ghTntPZ",

  // Optional: if you put a proxy/Cloudflare Worker in front of Discord, put its URL here.
  // Leave blank to post directly to the Discord webhook above.
  webhookProxyUrl: "",

  // Community + contact details
  discordInvite: "https://discord.gg/REPLACE_ME",
  contactEmail: "support@realm-tag.example",

  // Download details
  downloadPath: "downloads/game.apk",
  version: "1.0.0",
  apkSize: "790 MB",
  updated: "November 8, 2026",

  // Used for social sharing metadata if you add it later
  siteUrl: "https://realm-tag.example",
};
