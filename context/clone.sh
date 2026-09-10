#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
APPS="$ROOT/apps"

mkdir -p "$APPS"

clone_repo() {
  local url="$1"
  local dest="$2"
  local path="$APPS/$dest"

  if [[ -d "$path/.git" ]]; then
    echo "Updating apps/$dest ..."
    git -C "$path" pull --ff-only
  elif [[ -d "$path" ]]; then
    echo "Skipping apps/$dest: $path exists but is not a git clone"
  else
    echo "Cloning apps/$dest ..."
    git clone --depth 1 "$url" "$path"
  fi
}

clone_repo git@github.com:Siphon880gh/Stocks-Trainer.git Stocks-Trainer
clone_repo git@github.com:Siphon880gh/leetcode-coach.git leetcode-coach

echo "Done. Catalog: $ROOT/README.md"
