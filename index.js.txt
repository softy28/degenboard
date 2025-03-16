// Backend for DegenBoard - Fetching & Ranking Top Traders

const express = require("express");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase Connection
const SUPABASE_URL = "https://yihkgcelflwhpeumbaslk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa2djZWxmbHdocGV1bWJhc2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDc3ODYsImV4cCI6MjA1NzcyMzc4Nn0.q3uIoIrZcI5cMHTx6nwCA7FJKZ9J50f2vwDASUfVPFc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch top traders from DexScreener
async function fetchTrades(timeframe) {
    try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/trades/solana`);
        const trades = response.data.trades;

        let walletStats = {};

        trades.forEach(trade => {
            const wallet = trade.wallet;
            const profit = trade.amountUsd;

            if (!walletStats[wallet]) {
                walletStats[wallet] = { totalProfit: 0, trades: 0 };
            }

            walletStats[wallet].totalProfit += profit;
            walletStats[wallet].trades++;
        });

        let sortedTraders = Object.keys(walletStats).map(wallet => ({
            wallet,
            totalProfit: walletStats[wallet].totalProfit,
            trades: walletStats[wallet].trades
        })).sort((a, b) => b.totalProfit - a.totalProfit);

        return sortedTraders.slice(0, 20); // Top 20 traders
    } catch (error) {
        console.error("Error fetching trades:", error);
        return [];
    }
}

// API Endpoints
app.get("/traders/top", async (req, res) => {
    const { timeframe } = req.query;
    const traders = await fetchTrades(timeframe);
    res.json(traders);
});

// Start server
app.listen(PORT, () => {
    console.log(`DegenBoard Backend running on port ${PORT}`);
});
