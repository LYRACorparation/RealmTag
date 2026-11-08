# RealmTag website

A static site for **RealmTag**, a free fan-made VR tag game. It includes:

- A landing page with game description, features, modes, download area, and FAQ.
- A star-rating form that sends to a Discord webhook.
- A content creator application page that sends to the same webhook.
- A staff application page that sends to the same webhook.
- Terms of Service and Privacy Policy pages.
- A download page wired to `downloads/game.apk`.

## Quick start

1. Your APK is already in place at:

   ```text
   downloads/game.apk
   ```

   To ship a new build, replace that file (keep the name, or update `downloadPath` in `config.js`).

2. Open `config.js` and update:

   - `webhookUrl` — already set to the webhook you provided.
   - `discordInvite` — replace the placeholder invite.
   - `contactEmail` — replace the placeholder support email.
   - `apkSize` — already set to `"790 MB"`; update it if you replace the build.
   - `version` and `updated` if needed.

3. Serve the folder over HTTP so the forms and fonts behave correctly:

   ```powershell
   cd realm-tag-site
   python -m http.server 8080
   ```

   Then open `http://localhost:8080`.

   You can also use VS Code Live Server, Netlify, Cloudflare Pages, GitHub Pages, or any static host.

## Forms and the webhook

All three forms post JSON directly to the Discord webhook in `config.js`:

- `rating` — star rating + optional review
- `creator` — creator program application
- `staff` — staff application

The payload uses Discord embeds, so each submission appears as a clean card in the channel. The webhook URL is public in the browser; anyone who views the source can find it. For a production site, consider putting a small proxy or Cloudflare Worker in front of Discord and setting `webhookProxyUrl` in `config.js`.

The site also has:

- A hidden honeypot field to reduce bot submissions.
- A short client-side cooldown after a successful submission.
- Required-field validation and accessible status messages.

## Customizing

- **Brand colors:** `assets/css/base.css` (`:root` variables). The site uses a purple palette; the `--lime`, `--lime-2`, and `--mint` variable names are legacy names that now hold purple accents.
- **Home page content:** `index.html`.
- **Download copy:** `download.html`.
- **Creator program:** `creators.html`.
- **Staff roles and application:** `staff.html`.
- **Legal text:** `terms.html` and `privacy.html`.
- **Logo:** `assets/logo.jpg`.
- **Hero gorilla:** `assets/gorilla.svg`.

## Notes

- The Terms of Service and Privacy Policy are practical templates, not legal advice. Have a lawyer review them before launch, especially if you collect data from minors or operate in regulated jurisdictions.
- RealmTag is presented as an independent fan project. The site includes disclaimers that it is not affiliated with Another Axiom or Gorilla Tag.
- Replace the placeholder `support@realm-tag.example` email and `https://discord.gg/REPLACE_ME` invite before publishing.
- The download buttons point to `downloads/game.apk`, which is included (790 MB). If you replace the build, keep the same filename or update `downloadPath` in `config.js`.
- `404.html` is the custom not-found page. Point your host's 404 handler at it (most static hosts do this automatically).
- The logo is a 2:1 banner, so it is shown at its natural ratio (`80x40`) rather than cropped or stretched. If you want a tighter square mark for the favicon or app icon, supply a square version and update the `favicon` link and `site.webmanifest`.
