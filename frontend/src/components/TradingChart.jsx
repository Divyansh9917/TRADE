"use client";
import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";

export default function TradingChart({ onPriceUpdate }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    // 1. Initialize Chart Configuration
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: "solid", color: "transparent" }, textColor: "#d4d4d8" },
      grid: { vertLines: { color: "#27272a" }, horzLines: { color: "#27272a" } },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: "#27272a" },
      rightPriceScale: { borderColor: "#27272a" },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981", downColor: "#ef4444", borderVisible: false,
      wickUpColor: "#10b981", wickDownColor: "#ef4444",
    });

    // 2. Connect to Binance Live WebSocket (1-minute candles for BTC/USDT)
    const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");

    binanceSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const candle = message.k; // The candlestick data object
      
      const livePrice = parseFloat(candle.c);
      
      // Update the chart in real-time
      candlestickSeries.update({
        time: candle.t / 1000, // Convert ms to Unix seconds
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: livePrice,
      });

      // Pass the live price up to the main page if the prop exists
      if (onPriceUpdate) onPriceUpdate(livePrice);
    };

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    // Cleanup: Close socket when user leaves the page
    return () => {
      window.removeEventListener("resize", handleResize);
      binanceSocket.close();
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}