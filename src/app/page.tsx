'use client';

import { useEffect, useState } from 'react';

type BusData = {
  label: string;
  from: string;
  to: string;
  busNumber: string;
  direction: string;
  minutesLeft: number;
  secondsLeft: number;
  departureTime: string;
  formattedDepartureTime: string;
};

export default function Home() {
  const [busDataList, setBusDataList] = useState<BusData[]>([]);
  const [countdowns, setCountdowns] = useState<string[]>([]);

  // Fetch bus data from API
  useEffect(() => {
    const fetchBusData = async () => {
      const res = await fetch('/api/bus');
      const data = await res.json();
      setBusDataList(data);
    };

    fetchBusData();
  }, []);

  // Countdown for each connection
  useEffect(() => {
    if (!busDataList.length) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();

      const updatedCountdowns = busDataList.map((bus) => {
        const departureTime = new Date(bus.departureTime).getTime();
        const timeLeft = departureTime - now;

        if (timeLeft <= 0) return 'Departed';

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);

        return `${minutes} min ${seconds} sec`;
      });

      setCountdowns(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [busDataList]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Live Bus Info</h1>

      {busDataList.length > 0 ? (
        <div className="grid gap-6 w-full max-w-3xl">
          {busDataList.map((bus, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {bus.label} Route
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                {bus.from} → {bus.to}
              </p>
              <p>
                <span className="font-semibold">Bus Number:</span> {bus.busNumber}
              </p>
              <p>
                <span className="font-semibold">Direction:</span> {bus.direction}
              </p>
              <p>
                <span className="font-semibold">Arrives in:</span>{' '}
                <span className="text-green-600 font-bold">
                  {countdowns[index] ??
                    `${bus.minutesLeft} min ${bus.secondsLeft} sec`}
                </span>
              </p>
              <p>
                <span className="font-semibold">Exact Time (Zurich):</span>{' '}
                {bus.formattedDepartureTime}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </main>
  );
}