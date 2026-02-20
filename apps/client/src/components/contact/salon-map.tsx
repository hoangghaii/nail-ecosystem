import "leaflet/dist/leaflet.css";
import "@/utils/leaflet-icon-fix";

import { MapPin } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface SalonMapProps {
  address: string;
  latitude?: number;
  longitude?: number;
  salonName?: string;
}

function MapPlaceholder({ address }: { address: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[24px] border border-border bg-card p-8">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
        <MapPin className="h-5 w-5 text-primary" strokeWidth={1.5} />
      </div>
      <div>
        <p className="mb-1 font-sans text-sm font-medium text-muted-foreground">
          Địa Chỉ
        </p>
        <address className="font-sans text-base not-italic text-foreground">
          {address}
        </address>
      </div>
    </div>
  );
}

export function SalonMap({
  address,
  latitude,
  longitude,
  salonName = "Pink Nail Salon",
}: SalonMapProps) {
  const hasCoords =
    typeof latitude === "number" && typeof longitude === "number";

  if (!hasCoords) return <MapPlaceholder address={address} />;

  return (
    <div className="overflow-hidden rounded-[24px] border border-border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        className="h-80 w-full sm:h-96"
        aria-label="Salon location map"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{salonName}</strong>
            <br />
            {address}
            <br />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chỉ đường
            </a>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
