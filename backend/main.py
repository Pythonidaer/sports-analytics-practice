import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from database import get_db, engine, Base
from models import Game
from datetime import date

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

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

# Test database connection and insert sample data
@app.post("/api/test/insert-sample-data")
def insert_sample_data(db: Session = Depends(get_db)):
    # Create sample game
    sample_game = Game(
        game_date=date(2024, 4, 1),
        attendance=15000,
        ticket_price=25.00,
        day_of_week='Monday',
        temperature=72.5,
        precipitation=0.0,
        opponent='Rival Team',
        promotion='Opening Day',
        season='2024'
    )
    
    # Add to database
    try:
        db.add(sample_game)
        db.commit()
        db.refresh(sample_game)
        return {"message": "Sample data inserted successfully", "game_id": sample_game.id}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}

# Get all games
@app.get("/api/games")
def get_games(db: Session = Depends(get_db)):
    try:
        games = db.query(Game).all()
        return {"games": [{
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
        } for game in games]}
    except Exception as e:
        return {"error": str(e)}
