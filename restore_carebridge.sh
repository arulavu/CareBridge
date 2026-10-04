#!/usr/bin/env bash
set -euo pipefail
# Run from the root of your existing CareBridge Git repository.
if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  echo 'ERROR: Run this script inside your cloned CareBridge Git repository.' >&2; exit 1
fi
if [[ "$(pwd -P)" != "$(git rev-parse --show-toplevel)" ]]; then
  echo 'ERROR: Run from the repository root.' >&2; exit 1
fi
if ! git diff --quiet HEAD -- || ! git diff --cached --quiet; then
  echo 'ERROR: Uncommitted changes detected. Commit or stash them first.' >&2; exit 1
fi
ARCHIVE="${1:-CareBridge-main.zip}"
if [[ ! -f "$ARCHIVE" ]]; then echo "ERROR: Archive not found: $ARCHIVE" >&2; exit 1; fi
TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT
unzip -q "$ARCHIVE" -d "$TEMP"
SOURCE="$TEMP/CareBridge-main"
[[ -f "$SOURCE/index.html" && -f "$SOURCE/app.js" ]] || { echo 'ERROR: ZIP lacks expected CareBridge files.' >&2; exit 1; }
# Preserve git history and repository settings; remove only tracked application files.
git ls-files -z | xargs -0 -r git rm -q --
cp -a "$SOURCE"/. ./
# Avoid committing the supplied archive if stored in the repository.
git add --all -- ':!CareBridge-main.zip' ':!restore_carebridge.sh'
git commit -m 'Restore CareBridge to uploaded October 3 version'
echo 'Restored and committed. Review changes, then run: git push origin main'
