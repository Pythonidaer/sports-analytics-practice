import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Sports Analytics API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Sample data endpoint
@app.get("/api/games/summary")
async def get_games_summary():
    # This is a placeholder that will be replaced with actual database queries
    return {
        "total_games": 81,
        "avg_attendance": 15234,
        "total_revenue": 2450000,
        "popular_day": "Saturday"
    }
