import Link from 'next/link';
import { notFound } from 'next/navigation';

// Define the types for the data structures
// In a real app, these would be imported from a shared types file
interface Service {
  id: string;
  name: string;
  price: number;
}

interface Esthetician {
  id: string;
  fullName: string;
  description: string | null;
  profilePicture: string | null;
  services: Service[];
  portfolio: any; // Prisma returns Json type
  certifications: any; // Prisma returns Json type
}

// Data fetching function - runs on the server
async function getEsthetician(id: string): Promise<Esthetician | null> {
  // We need to use an absolute URL for fetching on the server.
  // Using an environment variable for the base URL is best practice.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/estheticians/${id}`, {
    // We add caching options to control how Next.js fetches data
    cache: 'no-store', // Use 'no-store' for dynamic data that changes often
  });

  if (!res.ok) {
    // If the response is 404, we can return null
    if (res.status === 404) {
      return null;
    }
    // For other errors, we could throw an error
    throw new Error('Failed to fetch esthetician');
  }

  return res.json();
}

// The page is now an async component
export default async function EstheticianProfilePage({ params }: { params: { id:string } }) {
  const esthetician = await getEsthetician(params.id);

  // If no esthetician is found, render the 404 page
  if (!esthetician) {
    notFound();
  }

  // Safely parse JSON fields with a fallback
  const portfolioImages: string[] = Array.isArray(esthetician.portfolio) ? esthetician.portfolio : [];
  const certificationsList: string[] = Array.isArray(esthetician.certifications) ? esthetician.certifications : [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={esthetician.profilePicture || 'https://via.placeholder.com/150'} alt={`Profile of ${esthetician.fullName}`} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Esthetician</div>
            <h1 className="block mt-1 text-2xl leading-tight font-medium text-black">{esthetician.fullName}</h1>
            <p className="mt-2 text-gray-500">{esthetician.description}</p>
          </div>
        </div>

        <div className="p-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Services</h2>
          <ul>
            {esthetician.services.map((service) => (
              <li key={service.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                <div>
                  <p className="text-gray-800 font-semibold">{service.name}</p>
                  <p className="text-gray-600 text-sm">€{service.price}</p>
                </div>
                <Link
                  href={`/esthetician/${esthetician.id}/book?service=${encodeURIComponent(service.name)}&price=${service.price}`}
                  className="bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-600 transition duration-200"
                >
                  Book
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Portfolio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioImages.map((image, index) => (
              <div key={index} className="w-full h-40 bg-gray-200">
                 <img src={image} alt={`Portfolio image ${index + 1}`} className="w-full h-full object-cover"/>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Certifications</h2>
          <ul className="list-disc list-inside">
            {certificationsList.map((cert) => (
              <li key={cert} className="text-gray-600">{cert}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
