# Betting AutoMaker — Terminal

Simple static terminal-like web app to manage 2–4 players betting into a pot. Features:

- Configure 2–4 players, starting points, and a minimum bet.
- "Start Round" will auto-bet the min from every player's points into the pot.
- Players can add extra amounts to the pot manually.
- Click "Declare Winner" by a player to give them the current pot; the next round auto-bets the min.

How to run

1. Open `index.html` in your browser (double-click or use your editor's preview), or run a tiny server:

```bash
cd /workspaces/bettingautomaker
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

Files

- `index.html` — UI
- `style.css` — styles (terminal-like)
- `main.js` — game logic

Deploy as a website

- GitHub Pages: push this repo to GitHub, then enable Pages on the `main` branch or `gh-pages` branch. The `index.html` will serve as the site root.
- Vercel / Netlify: link the repo and deploy; both services detect static sites automatically.

You can also host the static files on any static-file hosting provider (S3, Cloudflare Pages, Surge, etc.).
# bettingautomaker
yes
