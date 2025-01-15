import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css'
import PropTypes from 'prop-types';

// Sample data - GOAL: to replace with real data from a Kaggle CSV

// Sample data with units:
// - ticket_price: USD ($)
// - temperature: Fahrenheit (°F)
// - precipitation: inches
// - attendance: number of people
const sampleData = [
  { 
    game_date: '2023-04-01',
    attendance: 3200,
    ticket_price: 25,
    day_of_week: 'Saturday',
    temperature: 72,
    precipitation: 0,
    opponent: 'River Raiders',
    promotion: 'Opening Day',
    season: '2023'
  },
  { 
    game_date: '2023-04-15',
    attendance: 2800,
    ticket_price: 22,
    day_of_week: 'Saturday',
    temperature: 68,
    precipitation: 0,
    opponent: 'Mountain Moose',
    promotion: 'None',
    season: '2023'
  },
  { 
    game_date: '2022-04-01',
    attendance: 3100,
    ticket_price: 23,
    day_of_week: 'Friday',
    temperature: 70,
    precipitation: 0,
    opponent: 'River Raiders',
    promotion: 'Opening Day',
    season: '2022'
  },
  { 
    game_date: '2022-04-15',
    attendance: 2600,
    ticket_price: 20,
    day_of_week: 'Friday',
    temperature: 65,
    precipitation: 0.1,
    opponent: 'Mountain Moose',
    promotion: 'None',
    season: '2022'
  }
];

const DashboardCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 w-full mb-4">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div>{children}</div>
  </div>
);

// After your DashboardCard component definition, add the prop-types validation:
DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

const App = () => {
  const [selectedSeason, setSelectedSeason] = useState('2023');

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Metro Miners Analytics Dashboard</h1>
        <select 
          value={selectedSeason} 
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="2023">2023 Season</option>
          <option value="2022">2022 Season</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard title="Attendance Trends">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData.filter(item => item.season === selectedSeason)}>
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
              <div className="text-2xl">3,245</div>
            </div>
            <div className="p-4 bg-green-100 rounded">
              <div className="text-lg font-bold">Revenue Target</div>
              <div className="text-2xl">$82,450</div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default App;
