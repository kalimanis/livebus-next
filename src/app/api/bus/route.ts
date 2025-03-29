import { NextResponse } from 'next/server';

const fetchBusConnection = async (
    from: string,
    to: string,
    label: string
) => {
    const url = 'http://transport.opendata.ch/v1/connections';
    const params = new URLSearchParams({
        from,
        to,
        'transportations[]': 'bus',
        limit: '1',
    });

    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    if (!data.connections || data.connections.length === 0) return null;

    const connection = data.connections[0];
    const departureTimeStr = connection.from.departure;
    const departureTime = new Date(departureTimeStr);

    const busSection = (connection.sections as any[]).find(
        (section) => section.journey
    );

    if (!busSection || !busSection.journey) return null;

    const busNumber = busSection.journey.number;
    const direction = busSection.journey.to;

    const now = new Date();
    const timeDiff = (departureTime.getTime() - now.getTime()) / 1000;
    const minutesLeft = Math.floor(timeDiff / 60);
    const secondsLeft = Math.floor(timeDiff % 60);

    const formattedDepartureTime = new Intl.DateTimeFormat('de-CH', {
        timeZone: 'Europe/Zurich',
        hour: '2-digit',
        minute: '2-digit',
    }).format(departureTime);

    return {
        label,
        from,
        to,
        busNumber,
        direction,
        minutesLeft,
        secondsLeft,
        departureTime: departureTime.toISOString(),
        formattedDepartureTime,
    };
};

export async function GET() {
    try {
        const [outbound, inbound] = await Promise.all([
            fetchBusConnection('Zweiackerstrasse', 'Zurich HB', 'Outbound'),
            fetchBusConnection('Zurich HB', 'Zweiackerstrasse', 'Inbound'),
        ]);

        return NextResponse.json([outbound, inbound].filter(Boolean));
    } catch (error) {
        console.error('Error fetching bus info:', error);
        return new NextResponse('Error fetching data', { status: 500 });
    }
}