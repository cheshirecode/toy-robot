#!/usr/bin/env bash
# loop through all directories and generate package.actual.json

CURR_DIR=$(dirname "$0")
printf -- "\\e[4mSetup\\e[0m\\n"
for D in "$CURR_DIR"/*; do
  if [ -d "$D" ]; then
    script="$CURR_DIR/../index.js -r $D -o package.actual.json"
    printf -- " Running \\e[1m%s\\e[0m " "$script"
    $script
    exit_code=$?
    [ "$exit_code" != "0" ] && printf "\\e[31mfailed" || printf "\\e[32mfinished"
    printf "\\e[0m\\n"
  fi
done