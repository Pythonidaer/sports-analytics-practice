# Backend Setup Guide

## Prerequisites
- Python 3.12 or higher installed
- Git Bash terminal
- `.env` file with required environment variables

## First Time Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
source venv/Scripts/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Starting the Server

1. Navigate to the backend directory:
```bash
cd backend
```

2. Activate the virtual environment (if not already activated):
```bash
source venv/Scripts/activate
```
You'll know it's activated when you see `(venv)` at the start of your command prompt.

3. Start the server:
```bash
uvicorn main:app --reload --port 8000
```

The server will be running at http://localhost:8000

## Testing the API

- Visit http://localhost:8000/docs for interactive API documentation
- Test health check endpoint: http://localhost:8000/api/health
- View all games: http://localhost:8000/api/games
- Insert sample data through the /docs interface

## Notes

- You only need to create the virtual environment and install dependencies once
- You need to activate the virtual environment each time you open a new terminal
- Keep the terminal running to keep the server active
- Press Ctrl+C in the terminal to stop the server
