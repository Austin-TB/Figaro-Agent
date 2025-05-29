#!/usr/bin/env python3
"""
Start script for Figaro AI Assistant
Starts both the FastAPI backend and the React frontend.
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    # Check Python dependencies
    try:
        import fastapi
        import uvicorn
        print("✅ Backend dependencies found")
    except ImportError:
        print("❌ Backend dependencies missing. Run: pip install -r requirements.txt")
        return False
    
    # Check if frontend directory exists
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    # Check if node_modules exists
    node_modules = frontend_dir / "node_modules"
    if not node_modules.exists():
        print("❌ Frontend dependencies missing. Run: cd frontend && npm install")
        return False
    
    print("✅ Frontend dependencies found")
    return True

def start_backend():
    """Start the FastAPI backend"""
    print("🚀 Starting backend server...")
    return subprocess.Popen([
        sys.executable, "backend.py"
    ], cwd=os.getcwd())

def start_frontend():
    """Start the React frontend"""
    print("🚀 Starting frontend server...")
    return subprocess.Popen([
        "npm", "run", "dev"
    ], cwd="frontend", shell=True)

def main():
    print("🎭 Starting Figaro AI Assistant")
    print("=" * 50)
    
    if not check_dependencies():
        print("\n❌ Dependencies check failed. Please install missing dependencies.")
        sys.exit(1)
    
    try:
        # Start backend
        backend_process = start_backend()
        time.sleep(3)  # Give backend time to start
        
        # Start frontend
        frontend_process = start_frontend()
        
        print("\n🎉 Figaro is starting up!")
        print("📡 Backend: http://localhost:8000")
        print("🌐 Frontend: http://localhost:5173")
        print("\nPress Ctrl+C to stop both servers")
        
        # Wait for processes
        try:
            backend_process.wait()
        except KeyboardInterrupt:
            print("\n🛑 Shutting down servers...")
            backend_process.terminate()
            frontend_process.terminate()
            
            # Wait for processes to terminate
            backend_process.wait()
            frontend_process.wait()
            
            print("✅ Servers stopped successfully")
    
    except Exception as e:
        print(f"❌ Error starting servers: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 