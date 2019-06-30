#!/usr/bin/env bash
# loop through all directories and delete package.actual.json
CURR_DIR=$(dirname "$0")
printf -- "\\e[4mTeardown\\e[0m\\n"
for D in "$CURR_DIR"/*; do
  if [ -d "$D" ]; then
    file_path="$D/package.actual.json"
    script="rm $file_path"
    printf " Running \\e[1m%s\\e[0m" "$script "
    if [ -f "$file_path" ];
    then
      $script
      exit_code=$?
    else
      printf "File does not exist "
      exit_code=126
    fi
    [ "$exit_code" != "0" ] && printf "\\e[31mfailed" || printf "\\e[32mfinished"
    printf "\\e[0m\\n"
  fi
done