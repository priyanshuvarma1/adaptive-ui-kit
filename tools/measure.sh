#!/usr/bin/env bash
# Headlessly measure the design system at a list of resolutions.
#   npm run dev  &&  tools/measure.sh http://localhost:5173/probe.html 1366x768 3840x2160
set -u
URL=${1:?usage: measure.sh <url> <WxH>...}; shift
for wh in "$@"; do
  w=${wh%x*}; h=${wh#*x}
  google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --virtual-time-budget=4000 --window-size="$w,$h" --dump-dom "$URL" 2>/dev/null \
    | sed -n 's/.*<pre id="probe">\(.*\)<\/pre>.*/\1/p' | sed "s/^/$(printf '%-10s' "$wh")| /"
done
