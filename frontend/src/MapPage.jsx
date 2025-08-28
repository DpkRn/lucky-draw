


import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const WS_URL = 'ws://localhost:5000';

// Fix default marker icon issue in Leaflet with Webpack/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


function getOrCreateUserId() {
  let id = localStorage.getItem('locationWatchUserId');
  if (!id) {
    id = 'user-' + Math.floor(Math.random() * 1000000);
    localStorage.setItem('locationWatchUserId', id);
  }
  return id;
}

function MapPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [allLocations, setAllLocations] = useState({});
  const [error, setError] = useState(null);
  const [userId] = useState(getOrCreateUserId());

  // Memoize the custom icon so it's not recreated on every render
  const currentUserIcon = useMemo(() => {
    return new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }, []);

  // Watch user's own location and send to backend
  useEffect(() => {
    let watchId;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          // Send to backend
          fetch('http://localhost:5000/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, lat: latitude, lng: longitude })
          });
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, [userId]);

  // WebSocket for real-time location updates
  useEffect(() => {
    let ws;
    if (window.WebSocket) {
      ws = new window.WebSocket(WS_URL);
      ws.onmessage = (event) => {
        try {
          const locations = JSON.parse(event.data);
          setAllLocations(locations);
        } catch (e) {}
      };
    }
    return () => ws && ws.close();
  }, []);

  // Center map on user's location or default to India
  const center = userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Live User Locations</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full max-w-3xl mb-6" style={{height: 500}}>
        <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }} className="rounded-lg shadow overflow-hidden">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          {Object.entries(allLocations).map(([id, loc]) => {
            const isCurrentUser = id === userId;
            if (isCurrentUser) {
              return (
                <Marker key={id} position={[loc.lat, loc.lng]} icon={currentUserIcon}>
                  <Popup>
                    <span className="font-mono">You</span><br />
                    Lat: {loc.lat}, Lng: {loc.lng}
                  </Popup>
                </Marker>
              );
            } else {
              return (
                <Marker key={id} position={[loc.lat, loc.lng]}>
                  <Popup>
                    <span className="font-mono">{id}</span><br />
                    Lat: {loc.lat}, Lng: {loc.lng}
                  </Popup>
                </Marker>
              );
            }
          })}
        </MapContainer>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Your Location</h2>
        {userLocation ? (
          <div className="mb-4">Lat: {userLocation.lat}, Lng: {userLocation.lng}</div>
        ) : (
          <div className="mb-4 text-gray-500">Waiting for location permission...</div>
        )}
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <ul className="space-y-2">
          {Object.entries(allLocations).map(([userId, loc]) => (
            <li key={userId} className="border rounded p-2 flex justify-between">
              <span className="font-mono">{userId}</span>
              <span>Lat: {loc.lat}, Lng: {loc.lng}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MapPage;
