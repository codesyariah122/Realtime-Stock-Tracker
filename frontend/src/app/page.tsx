/**
 * @author PujiErmanto<pujiermanto@gmail.com>
 */

"use client";
import { StockChart, Panel } from "./components";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">📈 Real-Time Stock Tracker</h1>
      <StockChart symbol="AAPL" />
      <Panel />
    </div>
  );
}
