# Sound Garden

A nighttime musical garden made with Three.js and the Web Audio API. Choose a seed, click or tap the soil to plant it, and start sound to hear the garden play. Drag the scene to orbit; use Plant one or focus the garden and press Enter for keyboard planting. Change tempo and volume, undo the last bloom, or clear the garden.

## Run locally

From this directory run `python3 -m http.server 8000`, then open <http://localhost:8000>. Three.js and the display fonts are loaded from public CDNs, so an internet connection is required. Sound begins only after a user gesture, in keeping with browser autoplay rules.
