import { useState, useEffect } from 'react';
import { api } from './services/api'; // Import your API utility
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';
import PropTypes from 'prop-types';

const DashboardCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 w-full mb-4">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div>{children}</div>
  </div>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const App = () => {
  const [seasons, setSeasons] = useState([]); // Available seasons
  const [selectedSeason, setSelectedSeason] = useState(''); // Current season
  const [games, setGames] = useState([]); // Games for the selected season
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch available seasons on component mount
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const data = await api.getSeasons(); // Fetch seasons from API
        setSeasons(data);
        if (data.length > 0) {
          setSelectedSeason(data[0]); // Default to the most recent season
        }
      } catch (error) {
        console.error('Error fetching seasons:', error);
      }
    };

    fetchSeasons();
  }, []);

  // Fetch games for the selected season whenever it changes
  useEffect(() => {
    if (selectedSeason) {
      const fetchGames = async () => {
        setLoading(true);
        try {
          const data = await api.getGamesBySeason(selectedSeason); // Fetch games for the selected season
          setGames(data);
        } catch (error) {
          console.error('Error fetching games:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchGames();
    }
  }, [selectedSeason]);

  // Calculate metrics (e.g., average attendance)
  const calculateAverageAttendance = () => {
    if (!games.length) return 0;
    const totalAttendance = games.reduce((acc, game) => acc + game.attendance, 0);
    return Math.round(totalAttendance / games.length);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Metro Miners Analytics Dashboard</h1>
        <select 
          value={selectedSeason} 
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season} Season
            </option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard title="Attendance Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={games}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="game_date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Key Metrics">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 rounded">
                <div className="text-lg font-bold">Average Attendance</div>
                <div className="text-2xl">{calculateAverageAttendance()}</div>
              </div>
              <div className="p-4 bg-green-100 rounded">
                <div className="text-lg font-bold">Games Count</div>
                <div className="text-2xl">{games.length}</div>
              </div>
            </div>
          </DashboardCard>
        </div>
      )}
    </div>
  );
};

export default App;
