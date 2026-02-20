// Scoped CSS for Leaflet controls inside .salon-map-container
export const SALON_MAP_STYLES = `
  .salon-map-container .leaflet-popup-content-wrapper {
    background: #FDF8F5;
    border: 1px solid #e8d5d0;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(209,148,139,0.18);
    padding: 0;
    overflow: hidden;
  }
  .salon-map-container .leaflet-popup-content {
    margin: 0;
    padding: 16px 20px 20px;
  }
  .salon-map-container .leaflet-popup-tip-container {
    margin-top: -1px;
  }
  .salon-map-container .leaflet-popup-tip {
    background: #FDF8F5;
    box-shadow: none;
  }
  .salon-map-container .leaflet-popup-close-button {
    color: #b89490;
    top: 8px;
    right: 10px;
    font-size: 20px;
    width: 24px;
    height: 24px;
  }
  .salon-map-container .leaflet-popup-close-button:hover {
    color: #D1948B;
    background: transparent;
  }
  .salon-map-container .leaflet-control-zoom {
    border: 1px solid #e8d5d0 !important;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: none !important;
    margin: 16px !important;
  }
  .salon-map-container .leaflet-control-zoom a {
    color: #9b7b76;
    background: #FDF8F5;
    border-bottom: 1px solid #e8d5d0 !important;
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .salon-map-container .leaflet-control-zoom a:last-child {
    border-bottom: none !important;
  }
  .salon-map-container .leaflet-control-zoom a:hover {
    background: #f5e8e5;
    color: #C97E74;
  }
  .salon-map-container .leaflet-control-attribution {
    background: rgba(253,248,245,0.85);
    font-size: 10px;
    color: #b89490;
    border-radius: 8px 0 0 0;
    padding: 3px 8px;
  }
  .salon-map-container .leaflet-control-attribution a {
    color: #C97E74;
  }
`;
