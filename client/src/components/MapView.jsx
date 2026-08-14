import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation, Compass, AlertCircle } from "lucide-react";
import IssueStatusBadge from "./IssueStatusBadge";
import { getImageUrl } from "../utils/helpers";

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom colored pin creator
const createCustomIcon = (status) => {
  let color = "#3b82f6"; // Default blue
  if (status === "Resolved" || status === "Verified" || status === "Closed") color = "#10b981"; // Emerald
  else if (status === "In Progress") color = "#6366f1"; // Indigo
  else if (status === "Critical" || status === "Rejected") color = "#ef4444"; // Red
  else if (status === "Reported" || status === "Reopened") color = "#f59e0b"; // Amber

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#ffffff" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    html: svg,
    className: "custom-leaflet-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to handle map clicks for pin placement
const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({
        latitude: parseFloat(e.latlng.lat.toFixed(6)),
        longitude: parseFloat(e.latlng.lng.toFixed(6)),
      });
    },
  });
  return null;
};

// Component to re-center map dynamically
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
};

const MapView = ({
  center = [19.076, 72.8777], // Default Mumbai coords
  zoom = 13,
  selectable = false,
  selectedLocation = null,
  onLocationSelect = null,
  issues = [],
  className = "h-80 w-full",
}) => {
  const [currentPos, setCurrentPos] = useState(selectedLocation || { latitude: center[0], longitude: center[1] });
  const [gpsError, setGpsError] = useState("");

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            latitude: parseFloat(pos.coords.latitude.toFixed(6)),
            longitude: parseFloat(pos.coords.longitude.toFixed(6)),
          };
          setCurrentPos(loc);
          setGpsError("");
          if (onLocationSelect) onLocationSelect(loc);
        },
        (err) => {
          setGpsError("GPS permission denied or unavailable. Please click on the map manually.");
        }
      );
    } else {
      setGpsError("Geolocation is not supported by your browser.");
    }
  };

  const activeCenter = [
    selectedLocation?.latitude || currentPos.latitude || center[0],
    selectedLocation?.longitude || currentPos.longitude || center[1],
  ];

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      {selectable && (
        <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
          <button
            type="button"
            onClick={handleDetectGPS}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-blue-600 text-xs font-semibold rounded-xl shadow-md border border-slate-200 transition"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>Use My GPS Location</span>
          </button>
        </div>
      )}

      {gpsError && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2.5 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      <MapContainer center={activeCenter} zoom={zoom} scrollWheelZoom={true} className={className}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={activeCenter} />

        {selectable && <LocationPicker onLocationSelect={onLocationSelect} />}

        {/* Selected location pin */}
        {selectable && selectedLocation && selectedLocation.latitude && selectedLocation.longitude && (
          <Marker
            position={[selectedLocation.latitude, selectedLocation.longitude]}
            icon={createCustomIcon("Selected")}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-xs text-slate-900">Selected Location</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Lat: {selectedLocation.latitude}, Lng: {selectedLocation.longitude}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Display issues markers */}
        {!selectable &&
          issues.map((issue) => {
            if (!issue.location?.latitude || !issue.location?.longitude) return null;
            return (
              <Marker
                key={issue._id}
                position={[issue.location.latitude, issue.location.longitude]}
                icon={createCustomIcon(issue.status)}
              >
                <Popup className="custom-issue-popup">
                  <div className="max-w-xs p-1">
                    {issue.images && issue.images.length > 0 && (
                      <img
                        src={getImageUrl(issue.images[0])}
                        alt={issue.title}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                    )}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {issue.category}
                      </span>
                      <IssueStatusBadge status={issue.status} size="sm" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">{issue.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">{issue.location?.address}</p>
                    <a
                      href={`/issues/${issue._id}`}
                      className="block text-center text-xs font-bold bg-blue-600 text-white py-1 rounded-md hover:bg-blue-700 transition"
                    >
                      View Details
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default MapView;
