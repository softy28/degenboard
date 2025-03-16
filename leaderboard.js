import { useState, useEffect } from "react";

export default function Leaderboard() {
  const [traders, setTraders] = useState([]);
  const [timeframe, setTimeframe] = useState("1d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTraders() {
      setLoading(true);
      try {
        const response = await fetch(`https://degenboard.vercel.app/traders/top?timeframe=${timeframe}`);
        const data = await response.json();
        setTraders(data);
      } catch (error) {
        console.error("Error fetching traders:", error);
      }
      setLoading(false);
    }
    fetchTraders();
  }, [timeframe]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Solana Degen Leaderboard</h1>
      <div className="mb-4">
        <button className={`px-4 py-2 mx-2 ${timeframe === "1d" ? "bg-blue-500" : "bg-gray-700"}`} onClick={() => setTimeframe("1d")}>1 Day</button>
        <button className={`px-4 py-2 mx-2 ${timeframe === "7d" ? "bg-blue-500" : "bg-gray-700"}`} onClick={() => setTimeframe("7d")}>7 Days</button>
        <button className={`px-4 py-2 mx-2 ${timeframe === "30d" ? "bg-blue-500" : "bg-gray-700"}`} onClick={() => setTimeframe("30d")}>30 Days</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full max-w-4xl border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">#</th>
              <th className="p-2">Wallet</th>
              <th className="p-2">Total Profit (SOL)</th>
              <th className="p-2">Trades</th>
            </tr>
          </thead>
          <tbody>
            {traders.map((trader, index) => (
              <tr key={index} className="text-center border-b border-gray-700">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{trader.wallet}</td>
                <td className="p-2">{trader.totalProfit.toFixed(2)}</td>
                <td className="p-2">{trader.trades}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
