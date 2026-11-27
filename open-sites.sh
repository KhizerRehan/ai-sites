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
  creative     sites under creative/
  interactive  sites under interactive/
  standalone   sites in their own top-level folder, including otis
  gallery      the interactive gallery page only
  live         deployed URLs from 50-sites-index.md
  all          creative + interactive + standalone

With no group, the script asks what to open. When it is not run from a
terminal it opens all instead.

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

urls_standalone() {
  for dir in "$ROOT"/*/; do
    d=$(basename "$dir")
    [ "$d" = otis ] && continue
    if [ -f "$dir/dist/index.html" ]; then
      echo "$BASE/$d/dist/"
    elif [ -f "$dir/index.html" ]; then
      echo "$BASE/$d/"
    fi
  done
  if [ -d "$ROOT/otis" ]; then
    echo "$OTIS_URL"
  fi
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
  grep -o 'https://[^)]*chatgpt\.site' "$ROOT/50-sites-index.md" || true
}

count() {
  "urls_$1" | wc -l | tr -d ' '
}

GROUPS_WANTED=""

add_group() {
  case "$1" in
    all) GROUPS_WANTED="$GROUPS_WANTED creative interactive standalone" ;;
    repo) GROUPS_WANTED="$GROUPS_WANTED standalone" ;;
    creative | interactive | standalone | gallery | live) GROUPS_WANTED="$GROUPS_WANTED $1" ;;
    *) return 1 ;;
  esac
}

choose_groups() {
  {
    echo "What do you want to open?"
    echo "  1) creative     $(count creative) sites"
    echo "  2) interactive  $(count interactive) sites"
    echo "  3) standalone   $(count standalone) sites"
    echo "  4) gallery      the interactive gallery page"
    echo "  5) live         $(count live) deployed sites"
    echo "  6) all          creative + interactive + standalone"
    printf 'Choose one or more (for example 1, or 1 2), q to quit: '
  } >&2
  read -r answer || answer=q
  for a in $(echo "$answer" | tr ',' ' '); do
    case "$a" in
      q | Q) exit 0 ;;
      1) a=creative ;;
      2) a=interactive ;;
      3) a=standalone ;;
      4) a=gallery ;;
      5) a=live ;;
      6) a=all ;;
    esac
    if ! add_group "$a"; then
      echo "not a valid choice: $a" >&2
      exit 2
    fi
  done
  if [ -z "$GROUPS_WANTED" ]; then
    echo "nothing chosen" >&2
    exit 0
  fi
}

PRINT=0
for arg in "$@"; do
  case "$arg" in
    --print) PRINT=1 ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      if ! add_group "$arg"; then
        usage >&2
        exit 2
      fi
      ;;
  esac
done

if [ -z "$GROUPS_WANTED" ]; then
  if [ -t 0 ]; then
    choose_groups
  else
    add_group all
  fi
fi

URLS=$(for g in $GROUPS_WANTED; do "urls_$g"; done | awk '!seen[$0]++')

if [ "$PRINT" -eq 1 ]; then
  echo "$URLS"
  exit 0
fi

for g in $GROUPS_WANTED; do
  case "$g" in
    standalone)
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
