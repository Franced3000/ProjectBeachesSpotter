import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "./index.css"

// Fix marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function AddMarker({ onAdd }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ latitude: lat, longitude: lng });
    },
  });

  return position === null ? null : (
    <Marker position={[position.latitude, position.longitude]}>
      <Popup>
        <AddBeachForm onAdd={onAdd} position={position} />
      </Popup>
    </Marker>
  );
}
function AddBeachForm({ onAdd, position }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bandieraBlu, setBandieraBlu] = useState(false); // Aggiunta dello stato per la bandiera blu

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location) return;
    await onAdd({ ...position, name, location, bandiera_blu: bandieraBlu }); // Aggiunta di bandiera_blu nell'oggetto inviato alla funzione onAdd
    setName('');
    setLocation('');
    setBandieraBlu(false); // Ripristino dello stato della bandiera blu dopo l'invio del modulo
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nome della Spiaggia:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Località:
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <label id='bandiera_blu'>
        Bandiera Blu
        <input
          type="checkbox"
          checked={bandieraBlu}
          onChange={(e) => setBandieraBlu(e.target.checked)}
        />
      </label>
      <button type="submit">Aggiungi Spiaggia</button>
    </form>
  );
}


function App() {
  const [beaches, setBeaches] = useState([]);

  useEffect(() => {
    async function fetchBeaches() {
      try {
        const response = await axios.get('http://localhost:3001/');
        console.log('Fetched beaches:', response.data); // Log dei dati ricevuti
        setBeaches(response.data);
      } catch (error) {
        console.error('Error fetching beaches:', error);
      }
    }
    fetchBeaches();
  }, []);

  const handleAddBeach = async (beach) => {
    try {
      const response = await axios.post('http://localhost:3001/', beach);
      console.log('Added beach:', response.data); // Log dei dati aggiunti
      setBeaches([...beaches, response.data]);
    } catch (error) {
      console.error('Error adding beach:', error);
    }
  };

  return (
    <div>
      <h1>BEACH SPOTTER</h1>
      <MapContainer center={[37.6, 13.6]} zoom={8} style={{ height: "600px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {Array.isArray(beaches) && beaches.map(beach => (
          <Marker key={beach._id} position={[beach.latitude, beach.longitude]}>
            <Popup>
              <div>
                <h2>{beach.name}</h2>
                <p>Posizione: {beach.location}</p>
                <p>Bandiera Blu: {beach.bandiera_blu ? 'sì' : 'no'}</p>
                <p>Meteo: {beach.weather}</p>
                <p>Temperatura: {beach.temperature ? `${beach.temperature.toFixed(1)}°C` : 'N/A'}</p> {/* Aggiunta la temperatura */}
                <p>Vento: {beach.windSpeed}</p> {/* Aggiunta la velocità del vento */}
              </div>
            </Popup>
          </Marker>
        ))}
        <AddMarker onAdd={handleAddBeach} />
      </MapContainer>
    </div>
  );
}

export default App;
