// src/app/api/bus/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const url = 'http://transport.opendata.ch/v1/connections';
    const params = new URLSearchParams({
        from: 'Zweiackerstrasse',
        to: 'Zurich HB',
        'transportations[]': 'bus',
        limit: '1',
    });

    try {
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();

        if (data.connections && data.connections.length > 0) {
            const connection = data.connections[0];
            const departureTimeStr = connection.from.departure;
            const departureTime = new Date(departureTimeStr);

            const busNumber = connection.sections[0].journey.number;
            const direction = connection.sections[0].journey.to;

            const now = new Date();
            const timeDiff = (departureTime.getTime() - now.getTime()) / 1000;
            const minutesLeft = Math.floor(timeDiff / 60);
            const secondsLeft = Math.floor(timeDiff % 60);

            return NextResponse.json({
                busNumber,
                direction,
                minutesLeft,
                secondsLeft,
                departureTime: departureTime.toISOString(),
                formattedDepartureTime: departureTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            });
        }

        return NextResponse.json(null);
    } catch (error) {
        console.error('Error fetching bus info:', error);
        return new NextResponse('Error fetching data', { status: 500 });
    }
}