# Otis — Stretchable-Face Portfolio Hero

> Condensed from the original one-shot rebuild prompt. That prompt also contained the complete source of every file and an asset download link; both are left out here because the source lives in this folder (`src/`, `index.html`, the config files) and the fourteen faces are in `public/faces/`.

## What this project is

"Otis Pell — character designer" is a one-screen portfolio hero where **you can grab the designer's cartoon face and pull it like taffy**. A giant one-line headline, "HEY, I'M OTIS", spans the full width in heavy Satoshi with a mustard highlighter stroke across the name, and directly under it a cobalt disc holds a 3D-cartoon bust of Otis — copper quiff, freckles, mustard turtleneck — whose hair breaks out over the top of the disc and over the headline.

Grab anywhere on him and the skin stretches out under your pointer into a long tapering tube while his expression changes with where you grabbed (the hair or ears: "OW"; the cheeks: "pinched"; anywhere else: a grimace, "being squeezed"). Let go and it snaps back with a rubbery wobble and he pulls a random face — tongue out, cackling, skeptical, whistling innocently, smug, cross-eyed. A quick tap startles him and jiggles his whole head. Up to four fingers can pull at once.

The longer you keep stretching him, the more he **flushes** — cheeks and nose first, then the whole face — and a "Patience" bar drains from cobalt to red beside a "Current mood" readout; at the bottom of his patience a release leaves him "seeing stars". Left alone for five seconds he goes back to neutral, his eyes follow your cursor left and right, and hovering his nose makes him cross-eyed. A handwritten "pull my face" note with an arrow points at him until the first pull, and a custom ring cursor appears over his face and tightens while you hold.

Around him: a short bio on the left ("I make faces for a living."), the mood meter and an "Every other Sunday · one email" subscribe pill on the right that answers "You're in. He's pulling a face about it.", a header with his avatar, `@otispell`, Work / Notes pills and a light/dark toggle, and an "As seen in" strip of six invented outlets each set in its own wordmark face.

## How the page works

- **The face is a raw WebGL2 mesh, not a CSS or canvas-2D trick.** `src/face/engine.ts` draws the portrait as a 128×128 grid in image-UV space. Each grab occupies one of four slots holding an anchor and an offset; the vertex shader moves every vertex by `offset × gaussian(distance from anchor)`, with the gaussian widening as the pull gets longer. That is what turns a pull into a tapering tube instead of a dragged sticker.
- **Releases are a damped spring.** While held, a slot follows the pointer almost rigidly and records its velocity; on release it is integrated as a spring (stiffness 260, damping 11, three sub-steps per frame), so it overshoots and wobbles back. The pull itself is rubber-banded with `tanh` to at most 1.1× the stage size, so it gets heavier the further it goes and never leaves the canvas.
- **Every expression is a separate image registered to the same framing.** `public/faces/` holds fourteen 1024×1024 cut-outs (a 2:3 bust padded to a square), all aligned to each other, so swapping the texture under the mesh changes the expression in place with a 90 ms crossfade. `engine.warm()` uploads the rest one at a time after the first frame so the first swap never hitches.
- **The disc and the face share one coordinate space.** The disc is drawn in the same image-UV space from `rig.disc`; below the disc's centre the bust is clipped by the disc's edge, above it the head is free to break out. `rig` in `src/content.ts` holds the landmarks — disc, nose, cheeks, face oval, hairline, side limits — measured on these exact images, and both the flush shader and the grab-zone logic read them.
- **The canvas covers the whole hero but never takes pointer events.** `FaceCanvas` lays a full-hero canvas over everything (so a stretched face can spill across the copy) with `pointer-events: none`, plus a hit layer over the stage. A grab only starts on an opaque pixel of the base face's alpha, sampled from a low-res copy, so the empty corners of the image and the copy beside it stay clickable.

## Checks that must pass

- The headline fills the width on desktop and the hair overlaps it.
- Grabbing the hair, a cheek and the chin give three different faces.
- Pulling draws out a long tapering tube and letting go wobbles back.
- A tap jiggles him and shows the startled face.
- Two fingers on a touch screen pull two tubes at once.
- Holding a stretch reddens his cheeks, then his face, and drains the patience bar; at low patience a release shows the dizzy face.
- Five seconds after a release his eyes follow the cursor and the nose makes him cross-eyed.
- The dark-mode toggle switches the palette and is remembered on reload.
- The subscribe form shows its reply.

## Constraints

- Reproduce, don't reinterpret: keep the copy, the colours, the grid size, the gaussian width, the spring constants, the flush rates and every value in `rig`.
- Do not replace the WebGL2 mesh with a CSS transform, an SVG filter, a canvas-2D warp, Three.js or a physics library, and do not add an animation library.
- Keep every accessibility attribute — `role="img"` and its `aria-label`, `aria-live`, `aria-pressed`, `aria-hidden` — and the reduced-motion block in `index.css`.
- The faces are registered to each other and to the landmarks in `rig`; do not crop, resize or re-export them. The page loads every face from `/faces/`.

## Tech stack

- Vite 6 + React 19 + TypeScript (`npm run lint` is `tsc --noEmit`), with `@vitejs/plugin-react`.
- Raw WebGL2 for the face and disc — two small shader programs in `src/face/engine.ts`, no graphics library.
- Tailwind CSS v4 via the `@tailwindcss/vite` plugin. There is no `tailwind.config.js`; the light and dark palettes, fonts and type scale are in `src/index.css`.
- Fonts by `<link>` in `index.html`: Satoshi from Fontshare for the headline and display type; Inter, Instrument Serif, Unbounded and JetBrains Mono from Google Fonts (the last three mostly set the press-strip wordmarks).
- `package.json` in this folder is the complete, pinned dependency list.

## Design notes

- **The headline is fitted, then the stage tucks under it.** From 768 px up, `useFitHeadline` sets the one-line "HEY, I'M OTIS" to a 100 px probe, measures it and scales the font so it spans the content box exactly, then publishes the final size as `--mega`. `.stage` pulls itself up by `0.62 × --mega` (0.3× on phones, where the headline wraps onto two lines), which is what puts his quiff over the type at every width. It refits on resize and once the web fonts are ready.
- **The flush only touches skin.** The fragment shader adds two cheek blobs and a nose blob as `flush` rises past 0, then the whole face oval past 0.4, plus a little extra wherever the skin is being stretched right now — but multiplies it by `smoothstep(0.04, 0.16, r − b)`, so only pixels whose red is well above their blue take it. Eye whites, irises, hair highlights and the cobalt disc stay clean.
- **Patience is the flush, inverted.** `flush` climbs while any slot is held (faster the longer the pull), starts decaying 1.6 s after the last release, and drains slowly. The mood meter shows `1 − flush` as a percentage and mixes the bar from the disc's cobalt toward red in `oklab` as it falls; below 20% a release deals `x_dizzy` instead of a random face.
- **Which face a grab pulls depends on where it lands, in image UV.** Above `rig.hairLine`, or out at the sides above the jaw, is the hair or an ear (`g_ouch`); a band across the cheeks is `g_squish`; anything else is `g_grimace`. Release faces are drawn from `releaseFaces` at random, never the same one twice in a row.
- **A tap is a poke, not a pull.** Under 240 ms with under 8 px of travel counts as a tap: it fires a slot with an initial velocity and no offset, so the spring alone produces a jiggle, and he looks startled.
- **Missing faces degrade instead of breaking.** Every image loads independently; one that fails falls back to the base face (a missing grab face borrows the grimace). If the base face itself fails, or the browser has no WebGL2, the stage falls back to a plain `<img>` of him on a CSS disc in the same position.
- **The render loop sleeps off screen.** An `IntersectionObserver` stops the engine's `requestAnimationFrame` loop when the hero leaves the viewport, and the canvas renders at no more than 2× device pixel ratio.
- **Touch only blocks scrolling on the face.** A finger that lands on an opaque pixel of the cut-out calls `preventDefault` so it can pull; a finger anywhere else scrolls the page as usual.
- **Light and dark are one palette swap.** The page colours are CSS variables on `:root`, overridden under `[data-theme='dark']`; the disc and the mustard marker are the same in both. The toggle starts from the system setting, remembers the choice in `localStorage` (and survives storage being blocked), and also rewrites the `theme-color` meta tag.
- **Copy lives in `src/content.ts`.** The name, handle, nav, bio, the invented press outlets with their wordmark fonts, each face's mood label, the release pool and the `rig` landmarks are all there. If the portrait is ever replaced, `rig` has to be re-measured on the new images.
