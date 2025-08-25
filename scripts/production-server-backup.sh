#!/usr/bin/env bash

echo "Environment: production"

PROJECT_NAME=$1
LOBBYGOW_API_KEY=$2
CURRENT_TIME=$(date +%F-%H-%M-%S)

BACKUPS_PATH="/var/backups/$PROJECT_NAME"

DATABASE_PATH="/var/www/$PROJECT_NAME/sqlite.db"
DATABASE_BACKUP_PATH="$BACKUPS_PATH/$CURRENT_TIME.sqlite.backup"

trap 'catch $? $LINENO' ERR

catch() {
  http POST https://lobbygow.bgord.dev/notification-send \
    kind="error" \
    subject="[$PROJECT_NAME] production server backup error" \
    content="Error occurred on $2 with status code $1" \
    bgord-api-key:"$LOBBYGOW_API_KEY"
  exit 1
}

echo "Creating a database backup: $DATABASE_PATH"
sqlite3 "$DATABASE_PATH" ".backup $DATABASE_BACKUP_PATH"
echo "Database backup created to: $DATABASE_BACKUP_PATH"

tar -czf "$DATABASE_BACKUP_PATH.tar.gz" "$DATABASE_BACKUP_PATH"
echo "Database backup compressed"
rm "$DATABASE_BACKUP_PATH"

find "$BACKUPS_PATH" -mtime +7 -exec rm {} \;
echo "Backups older than 7 days deleted"
