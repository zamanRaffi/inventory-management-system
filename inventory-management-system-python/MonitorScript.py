import os
import sys
import time
import subprocess

# Path to the file you want to monitor
file_to_watch = "admin_login.py"
last_modified_time = os.path.getmtime(file_to_watch)

def refresh_app():
    """Restarts the application."""
    os.execv(sys.executable, ['python'] + [file_to_watch])  # Restart the application

while True:
    time.sleep(1)  # Check every second
    current_modified_time = os.path.getmtime(file_to_watch)
    if current_modified_time != last_modified_time:
        print(f"{file_to_watch} has changed. Restarting...")
        refresh_app()
    last_modified_time = current_modified_time
