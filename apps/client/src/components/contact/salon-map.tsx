import "leaflet/dist/leaflet.css";

import "@/utils/leaflet-icon-fix";

import { MapPin } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { createSalonMarker } from "./salon-map-marker";
import { SALON_MAP_STYLES } from "./salon-map-styles";

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
    <div className="salon-map-container overflow-hidden rounded-[24px] border border-border">
      <style>{SALON_MAP_STYLES}</style>
      <MapContainer
        aria-label="Salon location map"
        center={[latitude, longitude]}
        className="h-[480px] w-full"
        scrollWheelZoom={false}
        zoom={16}
        zoomControl={true}
      >
        {/* CartoDB Voyager — warm colourful tiles, no API key needed */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker icon={createSalonMarker()} position={[latitude, longitude]}>
          <Popup>
            <div style={{ minWidth: "190px" }}>
              <p
                style={{
                  color: "#2d1f1d",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  margin: "0 0 4px",
                }}
              >
                {salonName}
              </p>
              <p
                style={{
                  color: "#6b4f4b",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: "13px",
                  lineHeight: "1.55",
                  margin: "0 0 14px",
                }}
              >
                {address}
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                rel="noopener noreferrer"
                style={{
                  alignItems: "center",
                  background: "rgba(209,148,139,0.1)",
                  border: "1px solid rgba(209,148,139,0.3)",
                  borderRadius: "20px",
                  color: "#C97E74",
                  display: "inline-flex",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  gap: "5px",
                  padding: "6px 14px",
                  textDecoration: "none",
                }}
                target="_blank"
              >
                Chỉ đường &rarr;
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
