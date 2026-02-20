import L from "leaflet";

// Custom pink teardrop marker matching the salon brand (Dusty Rose #D1948B)
export const createSalonMarker = () =>
  L.divIcon({
    className: "",
    iconSize: [52, 62],
    iconAnchor: [26, 62],
    popupAnchor: [0, -66],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 16px rgba(209,148,139,0.55))">
        <div style="
          width:52px;height:52px;
          background:linear-gradient(145deg,#E8B4AE,#C97E74);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          display:flex;align-items:center;justify-content:center;
          border:3.5px solid #FDF8F5;
        ">
          <svg style="transform:rotate(45deg);flex-shrink:0" width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
  });
