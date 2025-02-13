/**
 * @author PujiErmanto<pujiermanto@gmail.com>
 */

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from '@utils/commons'

const API_URL = BASE_URL;

// export function useStockData(symbol: string) {
//   const [realTimeData, setRealTimeData] = useState<{ time: string; price_idr: number }[]>([]);

//   const { data } = useQuery({
//     queryKey: ["stock", symbol],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/stock/${symbol}`);
//       return res.json();
//     },
//     refetchInterval: 3000,
//   });

//   useEffect(() => {
//     const wsUrl = `${API_URL.replace("http", "ws")}/ws/${symbol}`;
//     console.log("Connecting to WebSocket:", wsUrl);

//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => console.log("WebSocket Connected:", wsUrl);

//     ws.onmessage = (event) => {
//       try {
//         const newData = JSON.parse(event.data);
//         console.log("WebSocket Data Received:", newData);

//         if (newData.time && newData.price_idr) {
//           setRealTimeData((prev) => [...prev.slice(-9), newData]);
//         }
//       } catch (error) {
//         console.error("Error Parsing WebSocket Data:", error);
//       }
//     };

//     ws.onerror = (event) => {
//       console.error("WebSocket Error:", event);
//     };

//     ws.onclose = (event) => {
//       console.warn("WebSocket Closed:", event.reason || "Unknown Reason");
//     };

//     return () => {
//       console.log("Closing WebSocket:", wsUrl);
//       ws.close();
//     };
//   }, [symbol]);

//   useEffect(() => {
//     if (data && data.time) {
//       setRealTimeData((prev) => {
//         const formattedData = {
//           time: new Date(data.time).toLocaleTimeString(),
//           price_idr: data.price_idr ?? 0,
//           price_usd: data.price_usd ?? 0,
//         };
//         console.log("Updated Chart Data:", [...prev.slice(-9), formattedData]);
//         return [...prev.slice(-9), formattedData];
//       });
//     }
//   }, [data]);

//   return { realTimeData };
// }

export function useStockData(symbol: string) {
  const [realTimeData, setRealTimeData] = useState<{ time: string; price_idr: number }[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ["stock", symbol],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/stock/${symbol}`);
      return res.json();
    },
    refetchInterval: 60000,
  });

  useEffect(() => {
    const wsUrl = `${API_URL.replace("http", "ws")}/ws/${symbol}`;
    console.log("Connecting to WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("WebSocket Connected:", wsUrl);

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log("WebSocket Data Received:", newData);

        if (newData.time && newData.price_idr) {
          setRealTimeData((prev) => [...prev.slice(-9), newData]);
        }
      } catch (error) {
        console.error("Error Parsing WebSocket Data:", error);
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket Error:", event);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket Closed:", event.reason || "Unknown Reason");
    };

    return () => {
      console.log("Closing WebSocket:", wsUrl);
      ws.close();
    };
  }, [symbol]);

  useEffect(() => {
    if (data && data.time) {
      setRealTimeData((prev) => {
        const formattedData = {
          time: new Date(data.time).toLocaleTimeString(),
          price_idr: data.price_idr ?? 0,
          price_usd: data.price_usd ?? 0,
        };
        console.log("Updated Chart Data:", [...prev.slice(-9), formattedData]);
        return [...prev.slice(-9), formattedData];
      });
    }
  }, [data]);

  return { realTimeData, refetch };
}

