from sqlalchemy import Column, Integer, String, Date, Numeric
from database import Base

class Game(Base):
    __tablename__ = 'games'

    id = Column(Integer, primary_key=True, index=True)
    game_date = Column(Date)
    attendance = Column(Integer)
    ticket_price = Column(Numeric(10, 2))
    day_of_week = Column(String(10))
    temperature = Column(Numeric(5, 2))
    precipitation = Column(Numeric(5, 2))
    opponent = Column(String(100))
    promotion = Column(String(100))
    season = Column(String(4))
