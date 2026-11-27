# Bureau of Lost Things — Creative Brief

> Reconstructed from the built site on 2026-11-27. The original prompt was not saved.

Create a distinctive, storybook-archival website for the **Bureau of Lost Things**, a fictional archive for objects, moments and places that have gone missing. It should evoke a gentle office of wonder: filing drawers, rubber stamps, and tenderness for small forgotten things.

## Art direction

Use deep forest green ink (#21372c), parchment (#f2e9d1), cream (#faf4e5), brick red (#b73d2e), mustard gold (#d2a946) and dusty blue-grey (#adc4c5). Set headlines in Playfair Display with red italic emphasis, body in DM Sans, and labels, buttons and catalogue metadata in uppercase DM Mono. Use thin green rules, square corners and hard offset shadows. Build the illustrations in CSS, not photos: a tilted manila folder with a lined file sheet, a double-ruled "Found and kept" stamp and a brass key glyph on a blue panel; archive cards use single oversized symbols on pastel tiles. Motion is just a small lift on card hover.

## Experience

Begin with a dark notice bar declaring it a fictional archive, then a header with a serif brand and anchor links. The hero pairs a large headline and "Enter the archive" button with the folder illustration. Follow with a note from the bureau, then the archive: filter buttons for All records, Objects, Moments and Places that show or hide six record cards and track state with aria-pressed. Each card shows category, a "Filed under" tag, title, teaser and a "Read its story" button that opens a modal dialog with a short story; it closes with a button, Escape or a backdrop click. Then a dark green reminder section with a tilted note card on gold, and a footer calling it an imaginary place. No forms.

Make it responsive: three card columns, two under 850px, one under 550px. Use a labelled dialog and clear focus-visible outlines.
