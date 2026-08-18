# Salsa Solent — Course Library (prototype)

A members-only curriculum library for Salsa Solent Dance Academy. 90 lessons across six
courses, with per-lesson video slots, spaced-revisit progress tracking, a community feed,
and a public landing page in front of the sign-in.

This is a **prototype for review**, not a production site. Read the warnings below before
you put anything real behind it.

---

## ⚠️ The sign-in is not security

The gate is client-side. The member list lives in `src/App.jsx` and ends up in the
JavaScript bundle, so anyone can read the credentials by opening dev tools — or by
reading this repository.

Confirmed in the built output: `member@salsasolent.co.uk` appears in plain text in
`dist/assets/index-*.js`.

Also worth knowing: **publishing GitHub Pages from a private repository requires a paid
GitHub plan.** On a free account the repo must be public, which makes the entire
curriculum and the demo password public too.

For a test with a handful of people, that's fine. Before real students or real video:

- Move authentication server-side (WooCommerce Memberships against the existing
  salsasolent.com logins is the obvious route — students already have accounts)
- Put the videos on domain-locked or token-signed hosting, not unlisted YouTube

---

## Running it locally

Requires Node 20 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Demo sign-in: `member@salsasolent.co.uk` / `1959`

---

## Deploying to GitHub Pages

1. Create a repository and push this folder to the `main` branch.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes.

The site appears at `https://<your-username>.github.io/<repo-name>/`.

`vite.config.js` sets `base: "./"` so asset paths stay relative. That means the build
works at any subpath without hard-coding the repository name — no change needed if you
rename the repo or move it to a custom domain later.

---

## Where things live

```
index.html                    page shell, includes a noindex tag
src/main.jsx                  React entry point
src/index.css                 body reset only
src/App.jsx                   everything else: data, components, styles
.github/workflows/deploy.yml  build and publish to Pages
```

`src/App.jsx` is one file on purpose — it started as a single artifact. Splitting the
curriculum data into its own module is the first refactor worth doing if this becomes
real.

### Brand

The `BRAND` object at the top of `src/App.jsx` holds every colour, the typeface, the
company details and the outbound links. Nothing else in the file hard-codes a colour.
Hex values were sampled from a screenshot of salsasolent.com, so they may be a shade
out — the exact values are in Divi → Theme Options.

`BRAND.homeAfterLogin` decides where members land after signing in: `"community"` for the
feed, `"dash"` for the library.

### Adding videos

Each lesson has either a single `video` field or a `clips` array of labelled slots.
Both default to `null`, which renders a placeholder naming the ID to fill.

```js
// one video
{ id: "cas-b2-01", title: "Dile que no", video: "https://player.vimeo.com/video/123456789", ... }

// several labelled clips, shown as tabs over one player
clips: [
  { id: "cas-b1-01-a", label: "Básico", video: "https://player.vimeo.com/video/123456789" },
  { id: "cas-b1-01-b", label: "Side to side", video: null },
]
```

Any embeddable player URL works — Vimeo, Bunny Stream, Cloudflare Stream, YouTube.

### Progress tracking

Two marks per lesson: **watched**, then **practised** with a rating of shaky / getting
there / solid. The rating sets when the lesson returns to the "ready to revisit" queue,
on an expanding interval (see `INTERVALS`). Shaky always resets to two days.

### Community feed

The feed is the default landing page after sign-in. Members post, filter by kind
(questions, practice clips, socials, teacher notices), like and reply.

The part that matters: **a post can be attached to a lesson.** The post shows a chip
through to it, and the lesson page shows the posts attached to it under "From the
community" — so a question about setenta lives on the setenta lesson, and the next person
who gets stuck finds it there instead of asking again. That is the thing a Facebook group
structurally cannot do, and the reason for building a feed here at all.

`SEED_POSTS` holds six sample posts with invented member names, so the feed is not an
empty room during review. **Delete them before launch.**

Three things to settle before this goes live:

- **Moderation needs an owner.** Spam, a falling-out between members, someone wanting a
  clip taken down. Budget an hour a week and decide now who does it.
- **GDPR.** Practice clips are personal data and usually have other students in shot. You
  need a line in the terms covering what members may post and how content gets removed.
- **Seeding.** For the first month the feed lives or dies on teachers posting. "Tuesday
  we're doing setenta, watch lesson 4" is the highest-value content on there.

### Persistence

Sign-in, progress and community posts are stored in `localStorage` under
`salsa-solent-library-v1`, so they are per browser and per device. A real deployment needs
this in a database keyed to the student's account. The progress record shape is:

```js
{ watched: bool, rating: "shaky"|"getting"|"solid",
  reps: int, step: int, practisedAt: timestamp, due: timestamp }
```

Community posts need a proper backend — on WordPress that means BuddyPress/BuddyBoss or a
custom table. It is the one part of the build that cannot be a static page.

---

## Known gaps

- Nine lessons carry a "confirm before recording" note — figures whose exact step
  sequence needs checking against how Salsa Solent teaches them
- Two spellings to confirm: "Tournios" is written as *tornillos* (Son lesson 8), and
  "la flora" as *la flor* (Rueda lesson 6)
- No teacher-facing view of who has practised what — arguably the highest-value feature
  still missing, since it changes what gets taught on Tuesday
- Community posts have no moderation tools, reporting or delete
- White text on the brand orange is ~2.2:1, below the WCAG AA minimum of 4.5:1. The main
  site uses navy-on-orange in its CTA band, which passes; `orangeDeep` is in `BRAND` if
  you want to darken the buttons
- Single-file component; no tests
