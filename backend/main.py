import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import distinct
from dotenv import load_dotenv
from database import get_db, engine, Base
from models import Game
from datetime import datetime
from typing import List

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Sports Analytics API")

# Configure CORS
# Get the environment and CORS origins
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")  # Defaults to 'development'
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "")

# Set allowed origins dynamically
allowed_origins = []

if ENVIRONMENT == "development":
    # Allow local frontend during development
    allowed_origins.append("http://localhost:5173")
elif CORS_ORIGIN:
    # Add static origins from environment
    allowed_origins.extend(CORS_ORIGIN.split(","))
    # Dynamically add all possible deploy preview domains
    allowed_origins.extend([
        f"https://deploy-preview-{i}--sports-analytics-demo.netlify.app"
        for i in range(1, 101)  # Adjust range if necessary
    ])
    

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/debug-cors")
def debug_cors():
    return {"allowed_origins": allowed_origins}

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Insert sample data
@app.post("/api/test/insert-sample-data")
def insert_sample_data(db: Session = Depends(get_db)):
    sample_game = Game(
        game_date=datetime(2024, 4, 1).date(),
        attendance=15000,
        ticket_price=25.00,
        day_of_week='Monday',
        temperature=72.5,
        precipitation=0.0,
        opponent='Rival Team',
        promotion='Opening Day',
        season='2024'
    )
    try:
        db.add(sample_game)
        db.commit()
        db.refresh(sample_game)
        return {"message": "Sample data inserted successfully", "game_id": sample_game.id}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}

# Bulk add games
@app.post("/api/games/bulk")
def add_bulk_games(games: List[dict], db: Session = Depends(get_db)):
    try:
        for game_data in games:
            game_date = datetime.strptime(game_data["game_date"], "%Y-%m-%d").date()
            game = Game(
                game_date=game_date,
                attendance=game_data["attendance"],
                ticket_price=game_data["ticket_price"],
                day_of_week=game_data["day_of_week"],
                temperature=game_data["temperature"],
                precipitation=game_data["precipitation"],
                opponent=game_data["opponent"],
                promotion=game_data["promotion"],
                season=game_data["season"]
            )
            db.add(game)
        db.commit()
        return {"message": "Bulk games added successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Get unique seasons
@app.get("/api/seasons")
def get_seasons(db: Session = Depends(get_db)):
    try:
        seasons = db.query(Game.season).distinct().order_by(Game.season.desc()).all()
        return {"seasons": [season[0] for season in seasons]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get games by season
@app.get("/api/games/{season}")
def get_games_by_season(season: str, db: Session = Depends(get_db)):
    try:
        games = db.query(Game).filter(Game.season == season).all()
        return {
            "games": [
                {
                    "id": game.id,
                    "game_date": game.game_date,
                    "attendance": game.attendance,
                    "ticket_price": float(game.ticket_price),
                    "day_of_week": game.day_of_week,
                    "temperature": float(game.temperature),
                    "precipitation": float(game.precipitation),
                    "opponent": game.opponent,
                    "promotion": game.promotion,
                    "season": game.season
                } for game in games
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all games
@app.get("/api/games")
def get_games(db: Session = Depends(get_db)):
    try:
        games = db.query(Game).all()
        return {"games": [
            {
                "id": game.id,
                "game_date": game.game_date,
                "attendance": game.attendance,
                "ticket_price": float(game.ticket_price),
                "day_of_week": game.day_of_week,
                "temperature": float(game.temperature),
                "precipitation": float(game.precipitation),
                "opponent": game.opponent,
                "promotion": game.promotion,
                "season": game.season
            } for game in games
        ]}
    except Exception as e:
        return {"error": str(e)}
