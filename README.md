# ai-sites

A collection of 90 small AI-generated concept sites: 60 creative brand microsites, 25 interactive Three.js experiences and 5 standalone builds. Every site is static, so the whole collection runs from one local file server.

## Open the sites

```sh
./open-sites.sh
```

Run with no arguments and the script asks what to open, then starts the local servers it needs and opens each site in your default browser:

```
What do you want to open?
  1) creative     60 sites
  2) interactive  25 sites
  3) standalone   5 sites
  4) gallery      the interactive gallery page
  5) live         50 deployed sites
  6) all          creative + interactive + standalone
Choose one or more (for example 1, or 1 2), q to quit:
```

You can also name the groups directly and skip the question:

| Command | Opens |
| --- | --- |
| `./open-sites.sh creative` | the 60 sites under `creative/` |
| `./open-sites.sh interactive` | the 25 sites under `interactive/` |
| `./open-sites.sh standalone` | the 5 top-level sites, including Otis |
| `./open-sites.sh gallery` | the interactive gallery page only |
| `./open-sites.sh live` | the 50 deployed `chatgpt.site` URLs |
| `./open-sites.sh all` | creative + interactive + standalone |
| `./open-sites.sh creative gallery` | several groups at once |
| `./open-sites.sh --print creative` | lists the URLs without opening anything |

To only start the file server, run `./start-interactive-sites.sh`. It serves this folder at <http://localhost:8765/>, and the **Local** links below work while it is running.

## Layout

```
ai-sites/
├── creative/<name>/dist/        60 creative sites
├── interactive/<name>/          25 interactive Three.js sites
├── dino-playtime/               standalone sites
├── otis/
├── root-and-ritual/
├── steep-tea/
├── ultimate-burger/
├── interactive-gallery.html     index page for the interactive sites
├── 50-sites-index.md            creative sites with their deployed URLs
├── 25-interactive-sites.md      interactive sites list
├── open-sites.sh                open sites in the browser
└── start-interactive-sites.sh   serve this folder on port 8765
```

Each site also has a branch holding its original build history: `site/<name>` for creative and standalone sites, `interactive/<name>` for interactive ones. Because an interactive branch and its folder share a name, add `--` when you mean the branch, for example `git log interactive/glass-garden --`.

## Standalone sites (5)

| Site | Folder | Local | Notes |
| --- | --- | --- | --- |
| **Little Jurassic** — A world of dinosaurs | [`dino-playtime/`](dino-playtime/) | [open](http://localhost:8765/dino-playtime/dist/) | static files in `dist/` |
| **Otis Pell** — character designer | [`otis/`](otis/) | [open](http://127.0.0.1:5174/) | Vite + React source; needs its dev server |
| **Root & Ritual** — Goodness, bottled. | [`root-and-ritual/`](root-and-ritual/) | [open](http://localhost:8765/root-and-ritual/dist/) | static files in `dist/` |
| **STEEP** — A moment, beautifully steeped | [`steep-tea/`](steep-tea/) | [open](http://localhost:8765/steep-tea/dist/) | static files in `dist/` |
| **The Ultimate Burger** | [`ultimate-burger/`](ultimate-burger/) | [open](http://localhost:8765/ultimate-burger/dist/) | static files in `dist/` |

Otis loads its assets from the server root, so it runs from the Vite dev server instead of the file server: `cd otis && npm install && npm run dev -- --port 5174`. `./open-sites.sh standalone` starts it for you once dependencies are installed.

## Creative sites (60)

50 of these are also deployed; the rest are local only.

| Site | Folder | Local | Live |
| --- | --- | --- | --- |
| **After Hours** — A room for the music | [`creative/after-hours-jazz/`](creative/after-hours-jazz/) | [open](http://localhost:8765/creative/after-hours-jazz/dist/) | — |
| **Atlas Observatory** — A little closer to the infinite | [`creative/atlas-observatory/`](creative/atlas-observatory/) | [open](http://localhost:8765/creative/atlas-observatory/dist/) | — |
| **BLUE HOUR** — A body in motion | [`creative/blue-hour/`](creative/blue-hour/) | [open](http://localhost:8765/creative/blue-hour/dist/) | [live](https://blue-hour-dance-company.groovyring32.chatgpt.site) |
| **Bone & Bloom** — Marks with meaning | [`creative/bone-and-bloom/`](creative/bone-and-bloom/) | [open](http://localhost:8765/creative/bone-and-bloom/dist/) | [live](https://bone-and-bloom-tattoo.groovyring32.chatgpt.site) |
| **Bureau of Lost Things** — An archive of almost-forgotten things | [`creative/bureau-of-lost-things/`](creative/bureau-of-lost-things/) | [open](http://localhost:8765/creative/bureau-of-lost-things/dist/) | [live](https://bureau-of-lost-things-archive.groovyring32.chatgpt.site) |
| **Checkmate Club** — Make your move. | [`creative/checkmate-club/`](creative/checkmate-club/) | [open](http://localhost:8765/creative/checkmate-club/dist/) | [live](https://checkmate-club-chess.groovyring32.chatgpt.site) |
| **Citrus Lab** — A little more zest | [`creative/citrus-lab/`](creative/citrus-lab/) | [open](http://localhost:8765/creative/citrus-lab/dist/) | [live](https://citrus-lab-soda.groovyring32.chatgpt.site) |
| **Cloud Nine** — A little more sky | [`creative/cloud-nine/`](creative/cloud-nine/) | [open](http://localhost:8765/creative/cloud-nine/dist/) | [live](https://cloud-nine-kite-club.groovyring32.chatgpt.site) |
| **Daybreak Cycles** — Ride into the good part | [`creative/daybreak-cycles/`](creative/daybreak-cycles/) | [open](http://localhost:8765/creative/daybreak-cycles/dist/) | [live](https://daybreak-cycles-workshop.groovyring32.chatgpt.site) |
| **Deep Blue** — A journey below | [`creative/deep-blue/`](creative/deep-blue/) | [open](http://localhost:8765/creative/deep-blue/dist/) | [live](https://deep-blue-ocean-exhibit.groovyring32.chatgpt.site) |
| **Ember Kitchen** — Cook with fire | [`creative/ember-kitchen/`](creative/ember-kitchen/) | [open](http://localhost:8765/creative/ember-kitchen/dist/) | — |
| **Fable Farm** — A little wild, a lot of wonder | [`creative/fable-farm/`](creative/fable-farm/) | [open](http://localhost:8765/creative/fable-farm/dist/) | [live](https://fable-farm-flower-studio.groovyring32.chatgpt.site) |
| **Field Notes** — A Woodland Journal | [`creative/field-notes/`](creative/field-notes/) | [open](http://localhost:8765/creative/field-notes/dist/) | [live](https://field-notes-woodland-journal.groovyring32.chatgpt.site) |
| **Flora Radio** — Good things grow on air | [`creative/flora-radio/`](creative/flora-radio/) | [open](http://localhost:8765/creative/flora-radio/dist/) | — |
| **Future Garden** — The city is a living thing | [`creative/future-garden/`](creative/future-garden/) | [open](http://localhost:8765/creative/future-garden/dist/) | — |
| **Ghost Frequency** — A signal after dark | [`creative/ghost-frequency/`](creative/ghost-frequency/) | [open](http://localhost:8765/creative/ghost-frequency/dist/) | [live](https://ghost-frequency-podcast.groovyring32.chatgpt.site) |
| **Glasshouse** — A little light, held | [`creative/glasshouse/`](creative/glasshouse/) | [open](http://localhost:8765/creative/glasshouse/dist/) | [live](https://glasshouse-glass-studio.groovyring32.chatgpt.site) |
| **Golden Hour** — A little more life on film | [`creative/golden-hour/`](creative/golden-hour/) | [open](http://localhost:8765/creative/golden-hour/dist/) | [live](https://golden-hour-film-lab.groovyring32.chatgpt.site) |
| **GOOD DIRT** — A little mess. A lot of good. | [`creative/good-dirt/`](creative/good-dirt/) | [open](http://localhost:8765/creative/good-dirt/dist/) | [live](https://good-dirt-compost-club.groovyring32.chatgpt.site) |
| **Honeycomb Hotel** — Make room for the little things | [`creative/honeycomb-hotel/`](creative/honeycomb-hotel/) | [open](http://localhost:8765/creative/honeycomb-hotel/dist/) | [live](https://honeycomb-hotel-bee-club.groovyring32.chatgpt.site) |
| **HOT MESS** — Good food. Bad decisions. | [`creative/hot-mess/`](creative/hot-mess/) | [open](http://localhost:8765/creative/hot-mess/dist/) | [live](https://hot-mess-hot-sauce.groovyring32.chatgpt.site) |
| **Hush House** — The art of almost nothing | [`creative/hush-house/`](creative/hush-house/) | [open](http://localhost:8765/creative/hush-house/dist/) | [live](https://hush-house-perfume.groovyring32.chatgpt.site) |
| **OFF REGISTER** — A festival of letters | [`creative/kinetic-type/`](creative/kinetic-type/) | [open](http://localhost:8765/creative/kinetic-type/dist/) | [live](https://off-register-type-festival.groovyring32.chatgpt.site) |
| **Letterpress Lane** — Good things leave a mark | [`creative/letterpress-lane/`](creative/letterpress-lane/) | [open](http://localhost:8765/creative/letterpress-lane/dist/) | [live](https://letterpress-lane-print-workshop.groovyring32.chatgpt.site) |
| **LOW TIDE** — objects shaped by the shore | [`creative/low-tide/`](creative/low-tide/) | [open](http://localhost:8765/creative/low-tide/dist/) | [live](https://low-tide-ceramics-studio.groovyring32.chatgpt.site) |
| **Lunar Laundromat** — Give your laundry a little orbit | [`creative/lunar-laundromat/`](creative/lunar-laundromat/) | [open](http://localhost:8765/creative/lunar-laundromat/dist/) | [live](https://lunar-laundromat-club.groovyring32.chatgpt.site) |
| **Meridian Maps** — An atlas for the curious | [`creative/meridian-maps/`](creative/meridian-maps/) | [open](http://localhost:8765/creative/meridian-maps/dist/) | [live](https://meridian-maps-cartography.groovyring32.chatgpt.site) |
| **MONO MOUNTAIN** — Equipment for the long way out | [`creative/mono-mountain/`](creative/mono-mountain/) | [open](http://localhost:8765/creative/mono-mountain/dist/) | [live](https://mono-mountain-alpine.groovyring32.chatgpt.site) |
| **MONOLITH** — Architecture in the quiet | [`creative/monolith-architecture/`](creative/monolith-architecture/) | [open](http://localhost:8765/creative/monolith-architecture/dist/) | — |
| **Moth Club** — a little closer to the night | [`creative/moth-club/`](creative/moth-club/) | [open](http://localhost:8765/creative/moth-club/dist/) | [live](https://moth-club-nocturnal-society.groovyring32.chatgpt.site) |
| **Midnight Market** — Come hungry. Stay late. | [`creative/night-market/`](creative/night-market/) | [open](http://localhost:8765/creative/night-market/dist/) | [live](https://midnight-market-street-food.groovyring32.chatgpt.site) |
| **Nocturne** — Cinema after dark | [`creative/nocturne-cinema/`](creative/nocturne-cinema/) | [open](http://localhost:8765/creative/nocturne-cinema/dist/) | — |
| **Odd Object** — Museum of Everyday Curiosities | [`creative/odd-object/`](creative/odd-object/) | [open](http://localhost:8765/creative/odd-object/dist/) | [live](https://odd-object-museum.groovyring32.chatgpt.site) |
| **Orbital Post** — Mail for the great beyond | [`creative/orbital-post/`](creative/orbital-post/) | [open](http://localhost:8765/creative/orbital-post/dist/) | [live](https://orbital-post.groovyring32.chatgpt.site) |
| **Origami Airlines** — a little lift for the everyday | [`creative/origami-airlines/`](creative/origami-airlines/) | [open](http://localhost:8765/creative/origami-airlines/dist/) | [live](https://origami-airlines-paper-flight.groovyring32.chatgpt.site) |
| **The Other Side** — Skate Collective | [`creative/other-side/`](creative/other-side/) | [open](http://localhost:8765/creative/other-side/dist/) | [live](https://the-other-side-skate-collective.groovyring32.chatgpt.site) |
| **Paper Moon** — Stories for the curious | [`creative/paper-moon/`](creative/paper-moon/) | [open](http://localhost:8765/creative/paper-moon/dist/) | [live](https://paper-moon-story-publisher.groovyring32.chatgpt.site) |
| **Paper Museum** — A world made by hand | [`creative/paper-museum/`](creative/paper-museum/) | [open](http://localhost:8765/creative/paper-museum/dist/) | — |
| **Peak Play** — Climbing is for everybody | [`creative/peak-play/`](creative/peak-play/) | [open](http://localhost:8765/creative/peak-play/dist/) | [live](https://peak-play-climbing-club.groovyring32.chatgpt.site) |
| **Pixel Parade** — Press play on something new | [`creative/pixel-parade/`](creative/pixel-parade/) | [open](http://localhost:8765/creative/pixel-parade/dist/) | [live](https://pixel-parade-arcade-festival.groovyring32.chatgpt.site) |
| **Pocket Planetarium** — a little space to explore | [`creative/pocket-planetarium/`](creative/pocket-planetarium/) | [open](http://localhost:8765/creative/pocket-planetarium/dist/) | [live](https://pocket-planetarium-explorer.groovyring32.chatgpt.site) |
| **Salt & Stars** — A little closer to the universe | [`creative/salt-and-stars/`](creative/salt-and-stars/) | [open](http://localhost:8765/creative/salt-and-stars/dist/) | [live](https://salt-and-stars-desert.groovyring32.chatgpt.site) |
| **Second Life** — Furniture with a future | [`creative/second-life/`](creative/second-life/) | [open](http://localhost:8765/creative/second-life/dist/) | [live](https://second-life-restoration-atelier.groovyring32.chatgpt.site) |
| **Signal Tower** — Radio for curious ears | [`creative/signal-tower/`](creative/signal-tower/) | [open](http://localhost:8765/creative/signal-tower/dist/) | [live](https://signal-tower-community-radio.groovyring32.chatgpt.site) |
| **Slow Orbit** — make space for your mind | [`creative/slow-orbit/`](creative/slow-orbit/) | [open](http://localhost:8765/creative/slow-orbit/dist/) | [live](https://slow-orbit-sound.groovyring32.chatgpt.site) |
| **Small Hours** — a bookshop for the awake | [`creative/small-hours/`](creative/small-hours/) | [open](http://localhost:8765/creative/small-hours/dist/) | [live](https://small-hours-bookshop.groovyring32.chatgpt.site) |
| **Soft Signal** — less noise, more meaning | [`creative/soft-signal/`](creative/soft-signal/) | [open](http://localhost:8765/creative/soft-signal/dist/) | [live](https://soft-signal-design-magazine.groovyring32.chatgpt.site) |
| **Solstice** — A little sunshine, baked daily | [`creative/solstice-bakery/`](creative/solstice-bakery/) | [open](http://localhost:8765/creative/solstice-bakery/dist/) | — |
| **Sound of Rain** — a small poetry ritual | [`creative/sound-of-rain/`](creative/sound-of-rain/) | [open](http://localhost:8765/creative/sound-of-rain/dist/) | [live](https://sound-of-rain-poetry.groovyring32.chatgpt.site) |
| **Static Garden** — Instruments for electric growth | [`creative/static-garden/`](creative/static-garden/) | [open](http://localhost:8765/creative/static-garden/dist/) | [live](https://static-garden-synthesizer.groovyring32.chatgpt.site) |
| **Still Water** — A quieter kind of place | [`creative/still-water/`](creative/still-water/) | [open](http://localhost:8765/creative/still-water/dist/) | [live](https://still-water-bathhouse.groovyring32.chatgpt.site) |
| **Sunday Supper** — Come hungry, leave happy | [`creative/sunday-supper/`](creative/sunday-supper/) | [open](http://localhost:8765/creative/sunday-supper/dist/) | [live](https://sunday-supper-social-club.groovyring32.chatgpt.site) |
| **TERRA FORM** — Shaping what grows next | [`creative/terra-form/`](creative/terra-form/) | [open](http://localhost:8765/creative/terra-form/dist/) | [live](https://terra-form-landscape-studio.groovyring32.chatgpt.site) |
| **Tidepool** — An Archive of the Deep | [`creative/tidepool-archive/`](creative/tidepool-archive/) | [open](http://localhost:8765/creative/tidepool-archive/dist/) | — |
| **Tiny Giants** — Small worlds, big feelings | [`creative/tiny-giants/`](creative/tiny-giants/) | [open](http://localhost:8765/creative/tiny-giants/dist/) | [live](https://tiny-giants-model-studio.groovyring32.chatgpt.site) |
| **Velvet Planet** — A little further from everything | [`creative/velvet-planet/`](creative/velvet-planet/) | [open](http://localhost:8765/creative/velvet-planet/dist/) | [live](https://velvet-planet-retreat.groovyring32.chatgpt.site) |
| **Velvet Rope** — An archive of almost forgotten things | [`creative/velvet-rope/`](creative/velvet-rope/) | [open](http://localhost:8765/creative/velvet-rope/dist/) | [live](https://velvet-rope-fashion-archive.groovyring32.chatgpt.site) |
| **Weather or Not** — A museum of looking up | [`creative/weather-or-not/`](creative/weather-or-not/) | [open](http://localhost:8765/creative/weather-or-not/dist/) | [live](https://weather-or-not-museum.groovyring32.chatgpt.site) |
| **Wild Current** — Follow the water | [`creative/wild-current/`](creative/wild-current/) | [open](http://localhost:8765/creative/wild-current/dist/) | [live](https://wild-current-river-guide.groovyring32.chatgpt.site) |
| **Zigzag Zoo** — A little wild, a lot wonderful | [`creative/zigzag-zoo/`](creative/zigzag-zoo/) | [open](http://localhost:8765/creative/zigzag-zoo/dist/) | [live](https://zigzag-zoo-illustration-studio.groovyring32.chatgpt.site) |

## Interactive sites (25)

These load Three.js from a CDN, so they need an internet connection. The [gallery page](interactive-gallery.html) links to all of them ([open locally](http://localhost:8765/interactive-gallery.html)).

| Site | Folder | Local |
| --- | --- | --- |
| **Aurora Radio** | [`interactive/aurora-radio/`](interactive/aurora-radio/) | [open](http://localhost:8765/interactive/aurora-radio/) |
| **Bonsai Laboratory** | [`interactive/bonsai-laboratory/`](interactive/bonsai-laboratory/) | [open](http://localhost:8765/interactive/bonsai-laboratory/) |
| **Butterfly Sanctuary** | [`interactive/butterfly-sanctuary/`](interactive/butterfly-sanctuary/) | [open](http://localhost:8765/interactive/butterfly-sanctuary/) |
| **Candle Studio** | [`interactive/candle-studio/`](interactive/candle-studio/) | [open](http://localhost:8765/interactive/candle-studio/) |
| **Cloud Factory** | [`interactive/cloud-factory/`](interactive/cloud-factory/) | [open](http://localhost:8765/interactive/cloud-factory/) |
| **Coral Atelier** | [`interactive/coral-atelier/`](interactive/coral-atelier/) | [open](http://localhost:8765/interactive/coral-atelier/) |
| **Crystal Cavern** | [`interactive/crystal-cavern/`](interactive/crystal-cavern/) | [open](http://localhost:8765/interactive/crystal-cavern/) |
| **Firefly Forest** | [`interactive/firefly-forest/`](interactive/firefly-forest/) | [open](http://localhost:8765/interactive/firefly-forest/) |
| **Glass Garden** | [`interactive/glass-garden/`](interactive/glass-garden/) | [open](http://localhost:8765/interactive/glass-garden/) |
| **Ink in Water** | [`interactive/ink-in-water/`](interactive/ink-in-water/) | [open](http://localhost:8765/interactive/ink-in-water/) |
| **Kinetic Mobile** | [`interactive/kinetic-mobile/`](interactive/kinetic-mobile/) | [open](http://localhost:8765/interactive/kinetic-mobile/) |
| **Lava Lamp Lab** | [`interactive/lava-lamp-lab/`](interactive/lava-lamp-lab/) | [open](http://localhost:8765/interactive/lava-lamp-lab/) |
| **Marble Run** | [`interactive/marble-run/`](interactive/marble-run/) | [open](http://localhost:8765/interactive/marble-run/) |
| **Moon Lander** | [`interactive/moon-lander/`](interactive/moon-lander/) | [open](http://localhost:8765/interactive/moon-lander/) |
| **Neon Pinball** | [`interactive/neon-pinball/`](interactive/neon-pinball/) | [open](http://localhost:8765/interactive/neon-pinball/) |
| **Orbit Weaver** | [`interactive/orbit-weaver/`](interactive/orbit-weaver/) | [open](http://localhost:8765/interactive/orbit-weaver/) |
| **Origami Studio** | [`interactive/origami-studio/`](interactive/origami-studio/) | [open](http://localhost:8765/interactive/origami-studio/) |
| **Paper Flight** | [`interactive/paper-flight/`](interactive/paper-flight/) | [open](http://localhost:8765/interactive/paper-flight/) |
| **Planet Forge** | [`interactive/planet-forge/`](interactive/planet-forge/) | [open](http://localhost:8765/interactive/planet-forge/) |
| **Rain Room** | [`interactive/rain-room/`](interactive/rain-room/) | [open](http://localhost:8765/interactive/rain-room/) |
| **Sand Mandala** | [`interactive/sand-mandala/`](interactive/sand-mandala/) | [open](http://localhost:8765/interactive/sand-mandala/) |
| **Snow Globe** | [`interactive/snow-globe/`](interactive/snow-globe/) | [open](http://localhost:8765/interactive/snow-globe/) |
| **Sound Garden** | [`interactive/sound-garden/`](interactive/sound-garden/) | [open](http://localhost:8765/interactive/sound-garden/) |
| **Tidal Sculptor** | [`interactive/tidal-sculptor/`](interactive/tidal-sculptor/) | [open](http://localhost:8765/interactive/tidal-sculptor/) |
| **Tiny City** | [`interactive/tiny-city/`](interactive/tiny-city/) | [open](http://localhost:8765/interactive/tiny-city/) |
