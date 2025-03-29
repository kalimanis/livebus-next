'use client'

import { useEffect, useState } from 'react';

type BusData = {
  busNumber: string;
  direction: string;
  minutesLeft: number;
  secondsLeft: number;
  departureTime: string;
  formattedDepartureTime: string;
};

export default function Home() {
  const [busData, setBusData] = useState<BusData | null>(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const fetchBusData = async () => {
      const res = await fetch('/api/bus');
      const data = await res.json();
      setBusData(data);
    };

    fetchBusData();
  }, []);

  useEffect(() => {
    if (!busData) return;

    const departureTime = new Date(busData.departureTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = departureTime - now;

      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      setCountdown(`${minutes} min ${seconds} sec`);
    }, 1000);

    return () => clearInterval(interval);
  }, [busData]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Next Bus Info</h1>
        {busData ? (
          <>
            <p><span className="font-semibold">Bus Number:</span> {busData.busNumber}</p>
            <p><span className="font-semibold">Direction:</span> {busData.direction}</p>
            <p>
              <span className="font-semibold">Arrives in:</span>{' '}
              <span className="text-green-600 font-bold">{countdown || `${busData.minutesLeft} min ${busData.secondsLeft} sec`}</span>
            </p>
            <p><span className="font-semibold">Exact Time:</span> {busData.formattedDepartureTime}</p>
          </>
        ) : (
          <p className="text-gray-500">No buses available right now.</p>
        )}
      </div>
    </main>
  );
}