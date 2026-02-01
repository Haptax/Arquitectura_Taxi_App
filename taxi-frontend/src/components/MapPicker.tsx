import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';

type Coords = { lat: number; lng: number };

type Props = {
  value: Coords | null;
  onChange: (coords: Coords) => void;
  height?: number;
  label?: string;
};

const defaultCenter: Coords = { lat: 4.711, lng: -74.072 };

function ClickHandler({ onChange }: { onChange: (coords: Coords) => void }) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

export function MapPicker({ value, onChange, height = 260, label }: Props) {
  const center = value ?? defaultCenter;
  const MapContainerAny = MapContainer as any;
  const TileLayerAny = TileLayer as any;
  const CircleMarkerAny = CircleMarker as any;

  return (
    <div className="map-picker">
      {label && <p className="muted">{label}</p>}
      <MapContainerAny center={center} zoom={13} scrollWheelZoom className="map-container" style={{ height }}>
        <TileLayerAny
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        {value && <CircleMarkerAny center={value} radius={8} pathOptions={{ color: '#0f172a' }} />}
      </MapContainerAny>
      {value && (
        <p className="muted">
          Lat: {value.lat.toFixed(5)} | Lng: {value.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
