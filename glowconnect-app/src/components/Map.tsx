'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

// Define a custom icon for the markers
const customIcon = new Icon({
  iconUrl: 'https://via.placeholder.com/38x38.png?text=📍', // A placeholder pin
  iconSize: [38, 38],
});

// Define the type for the esthetician data
interface Esthetician {
  id: string;
  fullName: string;
  latitude: number;
  longitude: number;
  profilePicture: string;
}

interface MapProps {
  estheticians: Esthetician[];
}

const Map = ({ estheticians }: MapProps) => {
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {estheticians.map((esthetician) => (
        <Marker key={esthetician.id} position={[esthetician.latitude, esthetician.longitude]} icon={customIcon}>
          <Popup>
            <div>
              <h3>{esthetician.fullName}</h3>
              {/* In a real app, you'd use Next's Image component, but it can be tricky in Leaflet popups */}
              <img src={esthetician.profilePicture} alt={esthetician.fullName} width="100" />
              <p><a href={`/esthetician/${esthetician.id}`}>View Profile</a></p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
