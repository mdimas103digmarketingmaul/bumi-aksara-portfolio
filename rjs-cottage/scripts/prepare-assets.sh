#!/usr/bin/env bash
# Prepares every web asset in rjs-cottage/assets from the raw sources.
# Raw sources are NOT committed (≈60 MB). Re-run this script when sources change.
#
#   bash rjs-cottage/scripts/prepare-assets.sh
#
# Needs: ffmpeg (libx264) and Node (sharp, see images.mjs). Inputs:
#   VIDEO_DIR  – client videos  (default ~/Downloads/Beberapa Video RJS)
#   TESTI_DIR  – testimony screenshots (default ~/Downloads/Testimony RJS)
#   EXT_DIR    – operator photos downloaded from therainvillas.com (u1/ u2/ u3/, 00.webp …),
#                see assets/SOURCES.md for the original URLs.
#   FONT_DIR_FRAUNCES / FONT_DIR_INSTRUMENT – @fontsource-variable packages (files/)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
A="$ROOT/assets"
VIDEO_DIR="${VIDEO_DIR:-$HOME/Downloads/Beberapa Video RJS}"
TESTI_DIR="${TESTI_DIR:-$HOME/Downloads/Testimony RJS}"
EXT_DIR="${EXT_DIR:?set EXT_DIR to the folder with u1/ u2/ u3/ operator photos}"
FONT_DIR_FRAUNCES="${FONT_DIR_FRAUNCES:-$ROOT/../option-02-untuk-portfolio/node_modules/@fontsource-variable/fraunces/files}"
FONT_DIR_INSTRUMENT="${FONT_DIR_INSTRUMENT:?set FONT_DIR_INSTRUMENT to @fontsource-variable/instrument-sans/files}"
VENDOR_SRC="${VENDOR_SRC:-$ROOT/../website-thufeil-cfp/node_modules}"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$A/images" "$A/video" "$A/testimonials" "$A/fonts" "$A/icons" "$ROOT/js/vendor"

# ── 2. Client video → hero reel + stills ────────────────────────────
# Source B (snapgram.io_mlktakg9hdki.mp4, 720×1280) has burned-in captions on most
# shots; only these windows are caption-free (checked frame by frame at 0.1 s).
# The top 210 px are cropped to remove a third-party watermark (The Rain Villas logo).
V="$VIDEO_DIR/snapgram.io_mlktakg9hdki.mp4"
ffmpeg -v error -y -i "$V" -an -filter_complex "
  [0:v]trim=14.35:15.45,setpts=PTS-STARTPTS[a];
  [0:v]trim=23.50:24.70,setpts=PTS-STARTPTS[b];
  [0:v]trim=24.85:25.65,setpts=PTS-STARTPTS[c];
  [0:v]trim=29.50:30.80,setpts=PTS-STARTPTS[d];
  [a][b][c][d]concat=n=4:v=1:a=0,crop=720:1070:0:210,setpts=1.35*PTS,fps=30,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 25 -profile:v high -movflags +faststart \
  "$A/video/hero-reel.mp4"

still() { # still <time> <name>  (PNG; converted to WebP by images.mjs)
  ffmpeg -v error -y -ss "$1" -i "$V" -vf "crop=720:1070:0:210" -frames:v 1 "$TMP/$2.png"
}
still 14.90 v-forest-pool
still 24.10 v-window
still 25.20 v-billiard
still 30.20 v-evening-slide
still 0.10  v-dusk-pool

# ── 2b. Full tours for the Option 02 video section (with audio) ─────
# B trimmed before its end card (phone number from 30.9 s), watermark cropped.
ffmpeg -v error -y -i "$V" -t 30.5 -vf "crop=720:1070:0:210,format=yuv420p" \
  -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 96k -movflags +faststart "$A/video/tour-cottage-1.mp4"
ffmpeg -v error -y -ss 2.6 -i "$V" -frames:v 1 -vf "crop=720:1070:0:210" "$TMP/poster-tour-1.png"
# A = creator room tour of RJS Cottage 2; trimmed before "hubungi no di bio" (56.5 s).
VA="$VIDEO_DIR/snapgram.io_lbz1l5yrcs2r.mp4"
ffmpeg -v error -y -i "$VA" -t 56 -vf "scale=540:960,format=yuv420p" \
  -c:v libx264 -preset slow -crf 29 -c:a aac -b:a 80k -movflags +faststart "$A/video/tour-cottage-2.mp4"
ffmpeg -v error -y -ss 16 -i "$VA" -frames:v 1 -vf "scale=540:960" "$TMP/poster-tour-2.png"

# ── 3. Photos, video stills, testimonials, social preview (sharp) ──
node "$ROOT/scripts/images.mjs" "$EXT_DIR" "$TESTI_DIR" "$TMP"

# ── 5. Fonts + vendor scripts ───────────────────────────────────────
cp "$FONT_DIR_FRAUNCES/fraunces-latin-full-normal.woff2" "$A/fonts/fraunces-full.woff2"
cp "$FONT_DIR_FRAUNCES/fraunces-latin-full-italic.woff2" "$A/fonts/fraunces-full-italic.woff2"
cp "$FONT_DIR_INSTRUMENT/instrument-sans-latin-wght-normal.woff2" "$A/fonts/instrument-sans.woff2"
cp "$VENDOR_SRC/gsap/dist/gsap.min.js" "$ROOT/js/vendor/gsap.min.js"
cp "$VENDOR_SRC/gsap/dist/ScrollTrigger.min.js" "$ROOT/js/vendor/ScrollTrigger.min.js"
cp "$VENDOR_SRC/lenis/dist/lenis.min.js" "$ROOT/js/vendor/lenis.min.js"

echo "Assets ready in $A"
du -sh "$A"/* | sort -h
