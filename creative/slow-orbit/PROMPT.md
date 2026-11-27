# Slow Orbit — Creative Brief

> Reconstructed from the built site on 2026-11-27. The original prompt was not saved.

Create a distinctive, calming single-page website for **Slow Orbit**, a fictional ambient sound mixer for focus and rest. It should evoke a dim room, a pair of headphones and the world slowing to a gentle drift.

## Art direction

Use a dark indigo page (#111326) with off-white text (#f8f6ff), muted lavender-grey (#aaaac4), a pale lime accent (#d8f487) and lavender highlights. Set headlines in Space Grotesk at medium weight with tight tracking, one emphasis word in italic Georgia, and body copy in DM Sans. Keep everything soft: pill buttons, large-radius cards, hairline translucent borders. The hero art is a glowing CSS planet in a cream-to-violet gradient, circled by a tilted ring with two tiny lime moons, plus a frosted-glass pill with small waveform bars. The planet floats slowly; sound cards lift on hover.

## Experience

Start with a header (ringed logo, two links, a "Start listening" pill) and a split hero reading "Find your own orbit." with a lime button. Build the sound space, "A mood, made by you.": three large toggle cards (Soft rain, Deep drift, Golden hour), each with a gradient orb and a plus that becomes a minus when active. Synthesise the audio with the Web Audio API, not files: looped low-pass-filtered noise for rain, layered sine tones for the low drone and the higher shimmer. Sounds fade in and out, layer freely and share a master volume slider; a status line reports how many are playing. Follow with a "Less noise. More you." section of three steps, a rounded lavender closing card and a quiet footer.

Use semantic HTML, pressed-state toggle buttons, a labelled range input, a polite status region, audio that starts only on a user gesture, a single-column layout below 800px, and a reduced-motion rule that stops the floating animation and smooth scrolling.
