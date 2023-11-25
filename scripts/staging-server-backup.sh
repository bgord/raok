#!/usr/bin/env bash

echo "Environment: staging"

PROJECT_NAME=$1
CURRENT_TIME=$(date +%F-%H-%M-%S)

BACKUPS_PATH="/var/backups/$PROJECT_NAME"

DATABASE_PATH="/var/www/$PROJECT_NAME/sqlite.db"
DATABASE_BACKUP_PATH="$BACKUPS_PATH/$CURRENT_TIME.sqlite.backup"

FILES_PATH="/var/www/$PROJECT_NAME/files"
FILES_BACKUP_PATH="$BACKUPS_PATH/$CURRENT_TIME.files.tar.gz"

NEWSPAPERS_PATH="/var/www/$PROJECT_NAME/newspapers"
NEWSPAPERS_BACKUP_PATH="$BACKUPS_PATH/$CURRENT_TIME.newspapers.tar.gz"

echo "Creating a database backup: $DATABASE_PATH."
sqlite3 "$DATABASE_PATH" ".backup $DATABASE_BACKUP_PATH"
echo "Database backup created to: $DATABASE_BACKUP_PATH."

tar -czf "$DATABASE_BACKUP_PATH.tar.gz" "$DATABASE_BACKUP_PATH"
echo "Database backup compressed."
rm "$DATABASE_BACKUP_PATH"

echo "Creating a files backup: $FILES_PATH."
tar -czf "$FILES_BACKUP_PATH $FILES_PATH"
echo "Files backup created and compressed to: $FILES_BACKUP_PATH."

echo "Creating a newspapers backup: $NEWSPAPERS_PATH."
tar -czf "$NEWSPAPERS_BACKUP_PATH $NEWSPAPERS_PATH"
echo "Newspapers backup created and compressed to: $NEWSPAPERS_BACKUP_PATH."

find "$BACKUPS_PATH/*" -mtime +7 -exec rm {} \;
echo "Backups older than 7 days deleted"
