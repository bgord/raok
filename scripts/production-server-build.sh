#!/usr/bin/env bash

# Preload base bash configuration and functions
source bgord-scripts/base.sh
setup_base_config

OUT_DIR="build"

info "Environment: production"
export NODE_ENV="production"

check_if_file_exists .env.production
check_if_directory_exists node_modules
check_if_file_exists scripts/production-server-start.sh
check_if_file_exists scripts/production-server-backup.sh
validate_environment_file

# ==========================================================

info "Building project!"

# ==========================================================

rm -rf $OUT_DIR
info "Cleaned previous build cache"

# ==========================================================

cp node_modules/@bgord/design/dist/main.min.css static/
cp node_modules/@bgord/design/dist/normalize.min.css static/
info "Copied CSS"

# ==========================================================

./bgord-scripts/css-purge.sh

# ==========================================================

npx tsc --strict --esModuleInterop --outDir $OUT_DIR
info "Compiled TypeScript"

# ==========================================================

cp package.json $OUT_DIR
cp package-lock.json $OUT_DIR
cd $OUT_DIR
HUSKY=0 npm ci --omit=dev --ignore-scripts
cd ../
info "Installed packages"

# ==========================================================

./bgord-scripts/frontend-build.sh
info "Built frontend"

# ==========================================================

if test -d static
then
  cp -r static $OUT_DIR
  info "Copied static files"
else
  info "static/ directory doesn't exist, step skipped"
fi

# ==========================================================

cp .env.production $OUT_DIR
info "Copied .env.production"

# ==========================================================

if test -d prisma
then
  cp -r prisma/migrations $OUT_DIR
  cp prisma/schema.prisma $OUT_DIR
  info "Copied prisma files"
else
  info "prisma/ directory doesn't exist, step skipped"
fi

# ==========================================================

cp scripts/production-server-{start,backup}.sh $OUT_DIR
info "Copied production-server-start and backup script"

# ==========================================================

if test -d frontend/views
then
  cp -r frontend/views $OUT_DIR/frontend/views
  info "Copied Handlebars views"
else
  info "frontend/views directory doesn't exist, step skipped"
fi

# ==========================================================

if test -d infra/translations
then
  cp -r infra/translations $OUT_DIR/infra
  info "Copied infra/translations"
else
  info "infra/translations/ directory doesn't exist, step skipped"
fi

# ==========================================================

mkdir $OUT_DIR/newspapers
info "Created newspapers directory"

# ==========================================================

mkdir $OUT_DIR/files
info "Created files directory"

# ==========================================================

npx gzip build/static/*.js --extension=gz --extension=br
npx gzip build/static/*.css --extension=gz --extension=br
npx gzip build/static/*.png --extension=gz --extension=br
npx gzip build/static/*.html --extension=gz --extension=br
npx gzip build/static/*.ico --extension=gz --extension=br
info "Compressing static files"

# ==========================================================
success "Project built correctly!"
