#!/bin/sh

echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la
echo "Checking dist directory:"
if [ -d "dist" ]; then
  ls -la dist/
  if [ -f "dist/app.js" ]; then
    echo "Starting application..."
    node dist/app.js
  else
    echo "app.js not found in dist directory. Available files:"
    find dist -type f -name "*.js" | sort
    echo "Trying to rebuild..."
    npm run build
    if [ -f "dist/app.js" ]; then
      node dist/app.js
    else
      echo "Failed to build app.js"
      exit 1
    fi
  fi
else
  echo "dist directory not found. Running build..."
  npm run build
  if [ -d "dist" ]; then
    ls -la dist/
    if [ -f "dist/app.js" ]; then
      node dist/app.js
    else
      echo "app.js not found after build"
      exit 1
    fi
  else
    echo "Failed to create dist directory"
    exit 1
  fi
fi