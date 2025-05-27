#!/bin/bash

# Daily AutBot Log Backup Script
# This script pulls AutBot logs from Heroku and saves them locally

# Configuration
HEROKU_APP_NAME="autbot-backend"  # Replace with your actual Heroku app name
LOG_DIR="$HOME/Code/ragaut/server-python/autbot_logs"      # Directory to store logs
DATE=$(date +%Y-%m-%d_%H-%M)
LOG_FILE="$LOG_DIR/autbot_logs_$DATE.txt"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Pull logs from Heroku (last 24 hours) and filter for AutBot entries
echo "Pulling AutBot logs for $DATE..."
heroku logs --app "$HEROKU_APP_NAME" --since="24 hours ago" | grep "AUTBOT_" > "$LOG_FILE"
# heroku logs --app "$HEROKU_APP_NAME" --num 10000 | grep "Received query" > "$LOG_FILE"

# Check if we got any logs
if [ -s "$LOG_FILE" ]; then
    echo "✅ Saved $(wc -l < "$LOG_FILE") AutBot log entries to $LOG_FILE"
else
    echo "⚠️  No AutBot logs found for $DATE"
    # Write "No logs found" to the file instead of removing it
    echo "No logs found for $DATE" > "$LOG_FILE"
fi


echo "Log backup complete!" 