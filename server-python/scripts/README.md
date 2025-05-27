# AutBot Log Backup Scripts

## Daily Log Backup

The `daily_log_backup.sh` script pulls AutBot logs from Heroku and saves them locally.

### Setup

1. **Edit the script** to set your Heroku app name:
   ```bash
   nano scripts/daily_log_backup.sh
   # Change: HEROKU_APP_NAME="autbot-backend"
   ```

2. **Test the script manually**:
   ```bash
   ./scripts/daily_log_backup.sh
   ```

3. **Set up daily cron job**:
   ```bash
   crontab -e
   ```
   
   Add this line to run daily at 2 AM (local system time):
   ```
   0 2 * * * /Users/autumn/Code/ragaut/server-python/scripts/daily_log_backup.sh
   ```

### What it does

- Pulls logs from Heroku using `heroku logs`
- Filters for only `AUTBOT_` entries
- Saves to `~/autbot_logs/autbot_logs_YYYY-MM-DD_HH-MM.txt`
- Reports how many log entries were saved

### Log file format

Each daily file contains:
```
2025-01-15T10:30:45.123456+00:00 app[web.1]: INFO:routes:AUTBOT_QUERY: What did Autumn do well?
2025-01-15T10:30:45.234567+00:00 app[web.1]: INFO:routes:AUTBOT_RESPONSE: Autumn did a fantastic job...
2025-01-15T10:30:45.345678+00:00 app[web.1]: INFO:routes:AUTBOT_CONTEXT: 3 chunks
2025-01-15T10:30:45.456789+00:00 app[web.1]: INFO:routes:AUTBOT_CONTEXT_0: Autumn Fjeld is a Product...
```

### Troubleshooting

- Make sure Heroku CLI is installed and logged in
- Check that the app name is correct
- Verify the script has execute permissions: `chmod +x scripts/daily_log_backup.sh` 