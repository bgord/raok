#!/usr/bin/env bash

echo "Environment: staging"
echo "Starting project..."

export NODE_ENV="staging"

cd /var/www/raok/ || exit
npx prisma migrate deploy
npx prisma generate
node index.js
