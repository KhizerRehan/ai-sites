# Orbital Post — Creative Brief

> Reconstructed from the built site on 2026-11-27. The original prompt was not saved.

Create a distinctive, playful single-page website for **Orbital Post**, a fictional interplanetary postal service for postcards from other planets. It should evoke retro space-age stationery, airmail stamps and the warmth of writing to someone who feels a universe away.

## Art direction

Use a cream page (#f9efcf) with deep navy ink (#0b2245), hot orange (#f05a2a), mustard yellow (#f6c84c) and pale sky blue (#aacbe1). Set oversized, tightly tracked headings in Space Grotesk and body copy in DM Sans with small uppercase eyebrows. Draw all imagery in CSS, no photos: thin concentric orbit rings, a ringed orange planet, a tilted "Special Delivery" postage stamp and asterisk stars. Use flat colour bands, 2px navy borders and hard offset shadows. Motion is limited to smooth scrolling and hover colour changes.

## Experience

Open with a bordered header (asterisk logo, two links, a "Write a postcard" button) and a two-column hero, "Wish you were here.", beside the planet. Follow with a static navy ticker, a short "Distance is just a detail" story and a blue band of three destination cards: Mars, Neptune and Saturn. The centrepiece is an orange section with a postcard composer: recipient, destination select, a message of up to 400 characters and sender. Submitting shows an in-page preview ("Greetings from Mars, ...") with a "Copy message" button that writes to the clipboard and reports success or a fallback hint, and a "Keep editing" button that hides the preview and refocuses the message. State clearly that this is a playful demo and no mail is sent or stored. Close with a navy footer signed "An imaginary service".

Use semantic HTML, labelled form fields, a live region for the preview and status, a single-column layout below 760px with the nav reduced to its button, and a reduced-motion rule that removes smooth scrolling and transitions.
