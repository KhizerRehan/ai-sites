# Origami Airlines — Creative Brief

> Reconstructed from the built site on 2026-11-27. The original prompt was not saved.

Create a distinctive, joyful single-page website for **Origami Airlines**, a fictional airline whose entire fleet is paper planes. It should evoke clear blue skies, vintage airline branding and the small thrill of letting a folded sheet of paper go.

## Art direction

Use bright sky blue (#45a9ed), deep navy (#082c4a), punchy red-orange (#fa4a2f), off-white paper (#fffdf3) and sunny yellow (#ffe56d) as full-width flat colour bands. Set headlines in Space Grotesk, huge and tightly tracked, and body text in DM Sans with small letterspaced uppercase eyebrows. Illustrate with inline SVG only: a large faceted paper plane with a dashed flight trail, faint concentric sky circles and a round rotated stamp. Use outlined pill buttons; the only motion is a slow marquee.

## Experience

Overlay the header (stacked wordmark, three links, a "Make a plane" pill) on a full-height blue hero reading "TAKE THE SCENIC ROUTE." crossed by the plane. Follow with a red marquee of playful cabin announcements and a story section about the imaginary airline. Build a dark "Ready, set, fold" guide as a four-step stepper for a classic dart: a diagram panel whose SVG is redrawn for each step, a "Step n of 4" label, title and instruction, four clickable progress segments, and Previous and Next buttons. Disable Previous on the first step and turn Next into "Start again" on the last. Then show a yellow destinations section with three boarding-pass tickets (three-letter codes, dashed tear line) for imaginary places, and a red closing band, "THE SKY IS CALLING.", linking back to the guide. The footer states it is a fictional airline.

Use semantic HTML, a live region for the step text, labelled progress buttons with a current marker, a single-column layout below 760px with nav links hidden, and a reduced-motion rule that stops the marquee and smooth scrolling.
