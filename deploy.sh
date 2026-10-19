#!/bin/bash

set -e

APP_NAME="youtubevault"
VERSION="${1:-v1.0.0}"

echo "============================================================"
echo "YouTubeVault Deployment"
echo "Version: ${VERSION}"
echo "============================================================"

echo ""
echo "1. Build application"
npm run build

echo ""
echo "2. Git status"
git status --short

echo ""
echo "3. Commit changes"
git add .
git commit -m "Release ${APP_NAME} ${VERSION}" || echo "No new changes to commit"

echo ""
echo "4. Push main"
git push origin main

echo ""
echo "5. Create Git tag"
if git rev-parse "${VERSION}" >/dev/null 2>&1; then
    echo "Tag ${VERSION} already exists."
else
    git tag -a "${VERSION}" -m "Release ${APP_NAME} ${VERSION}"
    git push origin "${VERSION}"
fi

echo ""
echo "6. Create GitHub Release"
if gh release view "${VERSION}" >/dev/null 2>&1; then
    echo "Release ${VERSION} already exists."
else
    gh release create "${VERSION}" \
        --title "${APP_NAME} ${VERSION}" \
        --generate-notes
fi

echo ""
echo "============================================================"
echo "DONE"
echo "============================================================"

echo ""
echo "🌐 Application:"
echo "https://maitheduy.github.io/${APP_NAME}/"

echo ""
echo "🔀 Fork:"
echo "https://github.com/maitheduy/${APP_NAME}/fork"

echo ""
echo "📥 Clone:"
echo "https://github.com/maitheduy/${APP_NAME}.git"

echo ""
echo "📦 Release:"
echo "https://github.com/maitheduy/${APP_NAME}/releases/tag/${VERSION}"
