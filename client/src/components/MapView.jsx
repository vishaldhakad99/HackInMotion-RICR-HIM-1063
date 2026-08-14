import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Navigation, AlertCircle } from "lucide-react";
import IssueStatusBadge from "./IssueStatusBadge";
import { getImageUrl } from "../utils/helpers";

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom colored pin creator for issues
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

// Animated Live Location User Marker
const createLiveUserIcon = () => {
  const html = `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(14, 165, 233, 0.4); animation: pulse-ring 2s infinite ease-out;"></div>
      <div style="position: relative; width: 18px; height: 18px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(2, 132, 199, 0.6);"></div>
    </div>
    <style>
      @keyframes pulse-ring {
        0% { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    </style>
  `;
  return L.divIcon({
    html,
    className: "custom-live-user-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
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
const RecenterMap = ({ center, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

const MapView = ({
  center = null,
  zoom = 14,
  selectable = false,
  selectedLocation = null,
  onLocationSelect = null,
  issues = [],
  showLiveUserLocation = true,
  className = "h-80 w-full",
}) => {
  const [liveUserPos, setLiveUserPos] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [gpsError, setGpsError] = useState("");
  const [isLocating, setIsLocating] = useState(true);
  const [manualCenter, setManualCenter] = useState(null);

  // Initialize live user geolocation watching
  useEffect(() => {
    if (!showLiveUserLocation && !selectable) return;

    if ("geolocation" in navigator) {
      setIsLocating(true);
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const loc = {
            latitude: parseFloat(pos.coords.latitude.toFixed(6)),
            longitude: parseFloat(pos.coords.longitude.toFixed(6)),
          };
          setLiveUserPos(loc);
          setAccuracy(pos.coords.accuracy || 30);
          setGpsError("");
          setIsLocating(false);
        },
        (err) => {
          console.warn("Geolocation warning:", err.message);
          setGpsError("Live GPS unavailable. Showing city view.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setGpsError("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  }, [showLiveUserLocation, selectable]);

  const handleRecenterToLiveGPS = useCallback(() => {
    if (liveUserPos) {
      setManualCenter([liveUserPos.latitude, liveUserPos.longitude]);
    } else if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            latitude: parseFloat(pos.coords.latitude.toFixed(6)),
            longitude: parseFloat(pos.coords.longitude.toFixed(6)),
          };
          setLiveUserPos(loc);
          setManualCenter([loc.latitude, loc.longitude]);
          setIsLocating(false);
          if (onLocationSelect) onLocationSelect(loc);
        },
        () => {
          setGpsError("Could not retrieve GPS location.");
          setIsLocating(false);
        }
      );
    }
  }, [liveUserPos, onLocationSelect]);

  // Determine effective map center
  const defaultFallbackCenter = [19.076, 72.8777]; // Mumbai
  const effectiveCenter =
    manualCenter ||
    (selectedLocation?.latitude && selectedLocation?.longitude
      ? [selectedLocation.latitude, selectedLocation.longitude]
      : center && center[0] && center[1]
      ? center
      : liveUserPos
      ? [liveUserPos.latitude, liveUserPos.longitude]
      : defaultFallbackCenter);

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Live Location Controls Overlay */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={handleRecenterToLiveGPS}
          disabled={isLocating}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md hover:bg-slate-50 text-sky-700 text-xs font-bold rounded-xl shadow-lg border border-slate-200 transition-all transform hover:scale-[1.03] cursor-pointer"
          title="Center map on my live position"
        >
          <Navigation className={`w-4 h-4 fill-sky-600 ${isLocating ? "animate-spin text-sky-600" : "text-sky-600"}`} />
          <span>{isLocating ? "Locating..." : "My Live Location"}</span>
        </button>

        {liveUserPos && (
          <div className="px-2.5 py-1 bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg shadow flex items-center gap-1.5 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live GPS: {liveUserPos.latitude}, {liveUserPos.longitude}</span>
          </div>
        )}
      </div>

      {gpsError && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-amber-50/95 backdrop-blur-sm border border-amber-200 text-amber-800 text-xs p-2.5 rounded-xl flex items-center gap-2 shadow-md">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      <MapContainer center={effectiveCenter} zoom={zoom} scrollWheelZoom={true} className={className}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={effectiveCenter} zoom={zoom} />

        {selectable && <LocationPicker onLocationSelect={onLocationSelect} />}

        {/* Live User Location Marker */}
        {showLiveUserLocation && liveUserPos && (
          <>
            <Marker position={[liveUserPos.latitude, liveUserPos.longitude]} icon={createLiveUserIcon()}>
              <Popup>
                <div className="p-1 text-center">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full text-[10px] font-extrabold mb-1">
                    <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping"></span>
                    Your Live Position
                  </div>
                  <p className="font-extrabold text-xs text-slate-900">You Are Here</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Lat: {liveUserPos.latitude}, Lng: {liveUserPos.longitude}
                  </p>
                </div>
              </Popup>
            </Marker>

            {accuracy && (
              <Circle
                center={[liveUserPos.latitude, liveUserPos.longitude]}
                radius={accuracy}
                pathOptions={{ color: "#0284c7", fillColor: "#38bdf8", fillOpacity: 0.15, weight: 1.5 }}
              />
            )}
          </>
        )}

        {/* Selected location pin (for location picking forms) */}
        {selectable && selectedLocation && selectedLocation.latitude && selectedLocation.longitude && (
          <Marker
            position={[selectedLocation.latitude, selectedLocation.longitude]}
            icon={createCustomIcon("Selected")}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-xs text-slate-900">Selected Issue Location</p>
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

