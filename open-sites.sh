#!/bin/sh
set -eu

ROOT=$(cd "$(dirname "$0")" && pwd)
PORT=8765
OTIS_PORT=5174
BASE="http://localhost:$PORT"
OTIS_URL="http://127.0.0.1:$OTIS_PORT/"

usage() {
  cat <<EOF
Usage: $(basename "$0") [--print] [group ...]

Groups:
  repo         sites inside this repo, including otis
  creative     sites under creative/
  interactive  sites under interactive/
  gallery      the interactive gallery page only
  live         deployed URLs from 50-sites-index.md
  all          repo + creative + interactive (default)

--print lists the URLs without opening them or starting servers.
EOF
}

up() {
  curl -s -o /dev/null --max-time 2 "$1"
}

wait_for() {
  i=0
  while ! up "$1"; do
    i=$((i + 1))
    if [ "$i" -gt 60 ]; then
      echo "timed out waiting for $1" >&2
      return 1
    fi
    sleep 0.25
  done
}

ensure_static() {
  up "$BASE/interactive-gallery.html" && return 0
  echo "starting static server on $BASE" >&2
  (cd "$ROOT" && nohup python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &)
  wait_for "$BASE/interactive-gallery.html"
}

ensure_otis() {
  up "$OTIS_URL" && return 0
  if [ ! -x "$ROOT/otis/node_modules/.bin/vite" ]; then
    echo "otis: dependencies missing, run npm install in $ROOT/otis" >&2
    return 1
  fi
  echo "starting otis dev server on $OTIS_URL" >&2
  (cd "$ROOT/otis" && nohup ./node_modules/.bin/vite --host 127.0.0.1 --port "$OTIS_PORT" --strictPort >/dev/null 2>&1 &)
  wait_for "$OTIS_URL"
}

urls_repo() {
  for dir in "$ROOT"/*/; do
    d=$(basename "$dir")
    [ "$d" = otis ] && continue
    if [ -f "$dir/dist/index.html" ]; then
      echo "$BASE/$d/dist/"
    elif [ -f "$dir/index.html" ]; then
      echo "$BASE/$d/"
    fi
  done
  [ -d "$ROOT/otis" ] && echo "$OTIS_URL"
}

urls_creative() {
  for f in "$ROOT"/creative/*/dist/index.html; do
    [ -f "$f" ] || continue
    echo "$BASE/creative/$(basename "$(dirname "$(dirname "$f")")")/dist/"
  done
}

urls_interactive() {
  for f in "$ROOT"/interactive/*/index.html; do
    [ -f "$f" ] || continue
    echo "$BASE/interactive/$(basename "$(dirname "$f")")/"
  done
}

urls_gallery() {
  echo "$BASE/interactive-gallery.html"
}

urls_live() {
  grep -o 'https://[^)]*chatgpt\.site' "$ROOT/50-sites-index.md"
}

PRINT=0
GROUPS_WANTED=""
for arg in "$@"; do
  case "$arg" in
    --print) PRINT=1 ;;
    -h | --help)
      usage
      exit 0
      ;;
    all) GROUPS_WANTED="$GROUPS_WANTED repo creative interactive" ;;
    repo | creative | interactive | gallery | live) GROUPS_WANTED="$GROUPS_WANTED $arg" ;;
    *)
      usage >&2
      exit 2
      ;;
  esac
done
[ -n "$GROUPS_WANTED" ] || GROUPS_WANTED="repo creative interactive"

URLS=$(for g in $GROUPS_WANTED; do "urls_$g"; done)

if [ "$PRINT" -eq 1 ]; then
  echo "$URLS"
  exit 0
fi

for g in $GROUPS_WANTED; do
  case "$g" in
    repo)
      ensure_static
      ensure_otis || true
      ;;
    creative | interactive | gallery) ensure_static ;;
  esac
done

if command -v open >/dev/null 2>&1; then
  OPENER=open
elif command -v xdg-open >/dev/null 2>&1; then
  OPENER=xdg-open
else
  echo "no browser opener found (open / xdg-open)" >&2
  exit 1
fi

COUNT=0
for u in $URLS; do
  "$OPENER" "$u"
  COUNT=$((COUNT + 1))
  sleep 0.2
done
echo "opened $COUNT tabs"
