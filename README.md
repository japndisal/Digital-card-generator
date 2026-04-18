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
