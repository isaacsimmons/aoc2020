#!/usr/bin/env bash

set -euo pipefail

source .env

day="${1:-}"

[ -z "$day" ] && {
    echo "Usage: init.sh <day>"
    exit 1;
}

mkdir "src/day$day"
cp templates/main.ts "src/day$day"

mkdir "inputs/day$day"

curl "https://adventofcode.com/2020/day/$day/input" \
  -H "cookie: session=$SESSION_COOKIE" \
  -o "inputs/day$day/input.txt"
touch "inputs/day$day/example1.txt"
