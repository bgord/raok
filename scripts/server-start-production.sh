#!/usr/bin/env bash

echo "Environment: production"
echo "Starting project..."

export NODE_ENV="production"

cd /var/www/raok/ || exit
npx prisma migrate deploy
npx prisma generate
node \
  --require tsx/cjs \
  --env-file=".env.$NODE_ENV" \
  index.js
