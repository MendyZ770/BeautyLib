'use client';

import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Define the type for the esthetician data, matching the Prisma model
// We can move this to a shared types file later
interface Esthetician {
  id: string;
  fullName: string;
  latitude: number;
  longitude: number;
  profilePicture: string | null; // Match Prisma schema
  // Add other fields as needed by the map/popups
}

const Map = dynamic(
  () => import('@/components/Map'),
  {
    loading: () => <p>Loading map...</p>,
    ssr: false
  }
);

export default function Home() {
  const [estheticians, setEstheticians] = useState<Esthetician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstheticians = async () => {
      try {
        const response = await fetch('/api/estheticians');
        if (!response.ok) {
          throw new Error('Failed to fetch estheticians');
        }
        const data = await response.json();
        setEstheticians(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEstheticians();
  }, []);

  if (loading) {
    return <p>Loading estheticians...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main className="w-screen h-screen">
      <Map estheticians={estheticians} />
    </main>
  );
}
