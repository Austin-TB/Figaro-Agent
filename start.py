import os
import subprocess
import time

print("Current working directory:", os.getcwd())

# Start backend as a background process
print("\n------------------------------Figaro Backend------------------------------")
backend_process = subprocess.Popen(['python', 'backend/backend.py'])

# Optional: wait a bit to let backend initialize
time.sleep(3)  # tweak if needed

# Change directory to frontend
os.chdir('frontend')
print("Changed directory to:", os.getcwd())

# Start frontend dev server (this will block until you stop it)
# Start frontend dev server (this will block until you stop it)
print("\n------------------------------Frontend Dev Server------------------------------")
try:
    subprocess.run('npm run dev', shell=True)
except KeyboardInterrupt:
    print("\nFrontend server interrupted.")


# Cleanup: kill backend when frontend stops or is interrupted
print("\nShutting down backend...")
backend_process.terminate()
backend_process.wait()
print("Backend process terminated.")
