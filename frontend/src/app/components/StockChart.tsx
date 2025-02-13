"use client";
import { useState, useEffect } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useStockData } from "@/hooks";

const stockSymbols = [
  "AAPL",
  "TSLA",
  "GOOGL",
  "MSFT",
  "AMZN",
  "META",
  "NVDA",
  "BABA",
  "NFLX",
  "INTC",
  "AGRO",
];

export default function StockChart({ symbol }: { symbol: string }) {
  const [inputValue, setInputValue] = useState<string>(symbol);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(symbol);
  const { realTimeData = [], refetch } = useStockData(selectedSymbol);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedSymbol, refetch]);

  const filteredSymbols = stockSymbols
    .filter((sym) =>
      sym.toLowerCase().includes(inputValue?.toLowerCase() || "")
    )
    .slice(0, 5);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Combobox
        value={selectedSymbol}
        onChange={(value) => {
          if (value !== null) {
            setSelectedSymbol(value);
            setInputValue(value);
          }
        }}
      >
        <div className="relative w-full">
          <div className="relative flex items-center">
            <ComboboxInput
              placeholder="Cari atau ketik simbol saham..."
              className="w-full border p-2 rounded pr-10"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <ComboboxButton className="absolute right-2">
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            </ComboboxButton>
          </div>

          {filteredSymbols.length > 0 && (
            <ComboboxOptions className="absolute left-0 w-full bg-white border rounded mt-1 shadow-lg z-10">
              {filteredSymbols.map((symbol) => (
                <ComboboxOption
                  key={symbol}
                  value={symbol}
                  className={({ active }) =>
                    `cursor-pointer flex justify-between items-center p-2 ${
                      active ? "bg-gray-200 text-black" : "bg-white"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span>{symbol}</span>
                      {selected && (
                        <CheckIcon className="w-5 h-5 text-green-500" />
                      )}
                    </>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
        </div>
      </Combobox>

      <div className="w-full max-w-screen-2xl h-100 bg-white shadow-md rounded-lg p-2 mt-4">
        <h2 className="text-xl font-bold mb-2">
          Harga {selectedSymbol} di pasar saham saat ini
        </h2>
        <small className="text-red-600 font-thin">
          *Pergerakan chart di update dalam 1 menit
        </small>
        <div className="w-full h-full ml-2">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={realTimeData} margin={{ left: 20 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ED2D56" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ED2D56" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="5 5" opacity={0.7} />
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} tickMargin={10} />
              <Tooltip />
              <Legend />

              {/* Area Chart */}
              <Area
                type="monotone"
                dataKey="price_idr"
                stroke="#ED2D56"
                fill="url(#colorPrice)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "#ED2D56" }}
                animationDuration={500}
              />

              {/* Line Chart */}
              <Line
                type="monotone"
                dataKey="price_idr"
                stroke="#007bff"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "#007bff" }}
              />

              {/* Bar Chart */}
              <Bar dataKey="volume" fill="#82ca9d" barSize={30} />

              {/* Scatter Plot */}
              <Scatter dataKey="price_idr" fill="gold" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
