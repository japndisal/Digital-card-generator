# Digital Business Card Creator

A web app that lets anyone build a personal digital business card in under a minute — with live preview, four visual themes, an AI-powered copywriter, a rotatable 3D card, and one-click export as a `.vcf` contact file that imports straight into any phone.

Built with Next.js 14 and the Gemini API (free tier). Deploys to Vercel in one click.

---

## What it does

Most business card generators either look generic or lock the good stuff behind a paywall. This one does three things differently:

- **AI writes the copy for you.** Stuck on a tagline or bio? Click *Generate* and Gemini drafts one based on your title and company. Already have a bio but it reads like a LinkedIn cliche? Click *Polish* and it gets sharper in one pass.
- **The preview is a real 3D card, not a flat PNG.** Drag it to rotate on both axes, hover for a parallax tilt, and flip it to reveal a back face with your bio and monogram. No Three.js — it's all CSS 3D transforms.
- **The export is the actual `.vcf` vCard format.** Download it, AirDrop it, text it to someone, and their phone's contacts app opens it natively. No QR scan required, no website visit, no app install.

## Features

- Four themes — Modern, Dreamy (gradient), Executive (dark), Editorial (serif)
- Three AI actions — Generate tagline, Generate bio, Polish bio
- 3D card preview — drag-to-rotate, hover tilt, flip animation, back face with bio
- Export as `.vcf` (vCard 3.0) or plain text
- Fully responsive — works on phones, tablets, desktops
- Zero localStorage, zero accounts, zero tracking

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Deploys to Vercel with zero config; API routes keep secrets server-side |
| UI | React 18 + Tailwind CSS | Fast iteration, utility classes keep the bundle small |
| Icons | lucide-react | Clean SVG icons, tree-shakeable |
| AI | Google Gemini 2.5 Flash-Lite | Genuine free tier, fast, decent prose quality |
| 3D | CSS `transform-style: preserve-3d` | No library needed — the browser handles it |
| Hosting | Vercel (free Hobby tier) | Free HTTPS, automatic deploys on git push |

## Getting started locally

You need Node.js 18+ and a free Gemini API key.

**1. Clone the repo**

```bash
git clone https://github.com/japndisal/Digital-card-generator.git
cd Digital-card-generator
```

**2. Install dependencies**

```bash
npm install
```

**3. Get a Gemini API key**

Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey), sign in with a Google account, and click *Create API key*. Free tier is generous — plenty for a personal project.

**4. Add your key locally**

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste your key after `GEMINI_API_KEY=`.

**5. Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click *Generate* on the tagline field to verify the AI is wired up.

## Deploying to Vercel

**1. Push this repo to GitHub** (if you haven't already).

**2. Import the project on Vercel**

Go to [vercel.com/new](https://vercel.com/new), click *Import Git Repository*, and select this repo. Vercel auto-detects Next.js — no config needed.

**3. Add the environment variable**

Before clicking *Deploy*, expand *Environment Variables* and add:

- Name: `GEMINI_API_KEY`
- Value: your key from AI Studio

**4. Deploy**

First build takes about 45 seconds. Every `git push` after this deploys automatically.

## Environment variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes | — | Get at [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `GEMINI_MODEL` | No | `gemini-2.5-flash-lite` | Swap for `gemini-3-flash-preview` if you want the newer model |

## Project structure

```
digital-card-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.js      ← Gemini proxy — keeps API key server-side
│   ├── globals.css           ← Tailwind directives
│   ├── layout.jsx            ← Root layout + metadata
│   └── page.jsx              ← Main component (the whole app)
├── public/                   ← Static assets
├── .env.local.example        ← Template — copy to .env.local
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

## How the AI layer works

The browser never talks to Gemini directly. That would leak your API key into the page source, and anyone opening DevTools could steal it.

Instead, the flow looks like this:

```
Browser (page.jsx)
    │  POST /api/generate  { prompt: "..." }
    ▼
Next.js route (app/api/generate/route.js)
    │  Reads GEMINI_API_KEY from process.env (server-only)
    │  POST to generativelanguage.googleapis.com
    ▼
Gemini responds with generated text
    ▲
Route returns just the text to the browser
```

The API key never exists in the browser bundle. You can verify this by viewing the page source in production — you won't find your key anywhere.

## How the 3D card works

No WebGL, no Three.js — just three CSS properties working together:

- `perspective: 1400px` on the outer wrapper — tells the browser to render children as if viewed from that distance. Without it, `rotateX` and `rotateY` just look like a 2D squash.
- `transform-style: preserve-3d` on the card — so its children keep their own 3D positions instead of being flattened.
- `backface-visibility: hidden` on each face — the back face sits on top of the front, pre-rotated 180°; without this, you'd see a mirrored ghost of whichever face is behind.

Rotation state is the sum of two values: `rotation` (from drag) and `tilt` (from hover parallax). Flip just adds 180° to the Y axis. The CSS `transition` on the card element handles all the smooth animation — no animation library required.

## Ideas for extending

- **QR code on the back face** — generate a QR that encodes the `.vcf` so people can scan and save without downloading
- **Custom avatar upload** — replace the auto-generated monogram with a real photo
- **Shareable URL** — encode the card data into a URL so you can send someone a link to your card
- **More themes** — neon, brutalist, hand-drawn
- **Multi-language** — Gemini handles non-English prompts well; add a language switcher
- **Rate limiting** — if this gets real traffic, add rate limits to the API route (Upstash has a free Redis tier that works great for this)

## License

MIT — do whatever you want with it. If you ship something cool, I'd love to hear about it.
