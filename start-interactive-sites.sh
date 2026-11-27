#!/bin/sh
# Serve the collection over HTTP.
cd "$(dirname "$0")" || exit 1
printf 'Open http://localhost:8765/interactive-gallery.html\n'
exec python3 -m http.server 8765 --bind 127.0.0.1
