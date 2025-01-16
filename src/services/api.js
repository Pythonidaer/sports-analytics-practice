const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  getSeasons: async () => {
    const response = await fetch(`${API_URL}/api/seasons`);
    if (!response.ok) throw new Error("Failed to fetch seasons");
    const data = await response.json();
    return data.seasons;
  },
  getGamesBySeason: async (season) => {
    const response = await fetch(`${API_URL}/api/games/${season}`);
    if (!response.ok) throw new Error("Failed to fetch games");
    const data = await response.json();
    return data.games;
  },
  addSampleData: async (games) => {
    const response = await fetch(`${API_URL}/api/games/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(games),
    });
    if (!response.ok) throw new Error("Failed to add sample data");
    return await response.json();
  },
};
