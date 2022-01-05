#!/usr/bin/env bash

# Preload base bash configuration and functions
source bgord-scripts/base.sh

info "Environment: local"
info "Watching frontend files..."

# ==========================================================

npx esbuild frontend/index.tsx \
  --bundle \
  --watch \
  --outdir=static/
