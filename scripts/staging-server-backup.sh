#!/usr/bin/env bash

echo "Environment: staging"

PROJECT_NAME=$1
CURRENT_TIME=$(date +%F-%H-%M-%S)

BACKUPS_PATH="/var/backups/$PROJECT_NAME"

DATABASE_PATH="/var/www/$PROJECT_NAME/sqlite.db"
DATABASE_BACKUP_PATH="$BACKUPS_PATH/$CURRENT_TIME.sqlite.backup"

echo "Creating a database backup: $DATABASE_PATH."
sqlite3 $DATABASE_PATH ".backup $DATABASE_BACKUP_PATH"
echo "Database backup created to: $DATABASE_BACKUP_PATH."

tar -czf "$DATABASE_BACKUP_PATH.tar.gz" "$DATABASE_BACKUP_PATH"
echo "Database backup compressed."
rm "$DATABASE_BACKUP_PATH"

find $BACKUPS_PATH/* -mtime +7 -exec rm {} \;
echo "Backups older than 7 days deleted"
