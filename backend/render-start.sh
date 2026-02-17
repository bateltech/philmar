#!/bin/sh
set -e

echo "=== Working Directory ==="
pwd

echo "=== Source files ==="
ls src/ || echo "!!! src/ NOT FOUND !!!"

echo "=== Checking nest CLI ==="
ls node_modules/.bin/nest || echo "!!! nest CLI NOT FOUND !!!"

echo "=== Checking tsc ==="
ls node_modules/.bin/tsc || echo "!!! tsc NOT FOUND !!!"

echo "=== Running tsc directly ==="
./node_modules/.bin/tsc -p tsconfig.build.json --listEmittedFiles 2>&1 || echo "!!! tsc FAILED with exit code $? !!!"

echo "=== dist/ contents after build ==="
ls -la dist/ || echo "!!! dist/ DOES NOT EXIST !!!"

echo "=== Starting server ==="
node dist/main
