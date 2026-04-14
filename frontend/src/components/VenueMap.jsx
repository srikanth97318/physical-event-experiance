import { MapContainer, TileLayer, Marker, Popup, Rectangle, CircleMarker } from 'react-leaflet';
import { IconMapPin, IconUsers } from '@tabler/icons-react';
import L from 'leaflet';

const myIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function levelColor(level) {
  if (level === 'High') return '#ef4444';
  if (level === 'Medium') return '#f59e0b';
  return '#22c55e';
}

function getLevelClass(level) {
  if (level === 'High') return 'high';
  if (level === 'Medium') return 'medium';
  return 'low';
}

export default function VenueMap({ center, zones, attendees, myPosition }) {
  return (
    <div style={{ marginTop: '16px' }}>
      <MapContainer
        center={center}
        zoom={18}
        scrollWheelZoom
        className="map-root"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {zones.map((zone) => (
          <Rectangle
            key={zone.id}
            bounds={[[zone.bbox[0], zone.bbox[1]], [zone.bbox[2], zone.bbox[3]]]}
            pathOptions={{
              color: levelColor(zone.level),
              weight: 3,
              fillOpacity: 0.3,
              fillColor: levelColor(zone.level)
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: '#1e293b' }}>{zone.name}</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', color: '#475569' }}>
                  <IconUsers size={16} />
                  <span>
                    {zone.occupancy}/{zone.capacity} attendees
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '4px' }}>
                  Queue: {zone.queueLength} people
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '12px' }}>
                  Est. wait: {zone.estimatedWaitMinutes} min
                </div>
                <span className={`badge ${getLevelClass(zone.level)}`}>{zone.level}</span>
              </div>
            </Popup>
          </Rectangle>
        ))}

        {attendees.map((attendee) => (
          <CircleMarker
            key={attendee.socketId}
            center={[attendee.lat, attendee.lng]}
            radius={8}
            pathOptions={{
              color: '#38bdf8',
              fillColor: '#0ea5e9',
              fillOpacity: 0.8,
              weight: 2
            }}
          >
            <Popup>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1e293b' }}>Anonymous attendee</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {attendee.zoneId || 'Outside zone'}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {myPosition && (
          <Marker position={[myPosition.lat, myPosition.lng]} icon={myIcon}>
            <Popup>
              <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>Your live location</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
