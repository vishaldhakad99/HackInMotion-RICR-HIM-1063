import React, { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Navigation, AlertCircle, Layers, Map as MapIcon, Globe, Image } from "lucide-react";
import "leaflet/dist/leaflet.css";
import IssueStatusBadge from "./IssueStatusBadge";
import { getImageUrl } from "../utils/helpers";
import { reverseGeocode } from "../services/mapServices";

// Inline SVG Data URIs for default Leaflet pins (100% asset independence)
const defaultPinSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284c7" width="32" height="32" stroke="%23ffffff" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: defaultPinSvg,
  iconUrl: defaultPinSvg,
  shadowUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'></svg>",
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

// Searched City Location Marker
const createSearchLocationIcon = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6366f1" width="36" height="36" stroke="#ffffff" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    html: svg,
    className: "custom-searched-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// High-Reliability Map Tile Providers Configuration
const MAP_TILE_PROVIDERS = {
  standard: {
    id: "standard",
    name: "OpenStreetMap",
    icon: Globe,
    url: import.meta.env.VITE_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "",
  },
  voyager: {
    id: "voyager",
    name: "CARTO Clean",
    icon: MapIcon,
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
  },
  topo: {
    id: "topo",
    name: "Esri Topo",
    icon: Layers,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
    subdomains: "",
  },
  satellite: {
    id: "satellite",
    name: "Esri Satellite",
    icon: Image,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    subdomains: "",
  },
};

// Helper component to continuously monitor container size and invalidate Leaflet map size
const MapResizeObserver = ({ containerRef }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Immediate size check stages
    const timer1 = setTimeout(() => map.invalidateSize(), 100);
    const timer2 = setTimeout(() => map.invalidateSize(), 350);
    const timer3 = setTimeout(() => map.invalidateSize(), 700);

    let observer;
    if (containerRef && containerRef.current && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        map.invalidateSize();
      });
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (observer) observer.disconnect();
    };
  }, [map, containerRef]);

  return null;
};

// Component to handle map clicks for pin placement with automatic reverse geocoding
const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    async click(e) {
      const latitude = parseFloat(e.latlng.lat.toFixed(6));
      const longitude = parseFloat(e.latlng.lng.toFixed(6));

      let address = `Lat: ${latitude}, Lng: ${longitude}`;
      try {
        const fetchedAddress = await reverseGeocode(latitude, longitude);
        if (fetchedAddress) address = fetchedAddress;
      } catch (err) {
        console.warn("Reverse geocode on click failed:", err);
      }

      onLocationSelect({
        latitude,
        longitude,
        address,
      });
    },
  });
  return null;
};

// Component to re-center map dynamically with smooth flyTo animation
const RecenterMap = ({ center, zoom = 14 }) => {
  const map = useMap();
  const prevCenterRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(center) && center.length === 2) {
      const lat = parseFloat(center[0]);
      const lng = parseFloat(center[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        if (!prevCenterRef.current || prevCenterRef.current[0] !== lat || prevCenterRef.current[1] !== lng) {
          prevCenterRef.current = [lat, lng];
          map.flyTo([lat, lng], zoom, { animate: true, duration: 1.2 });
        }
      }
    }
  }, [center, zoom, map]);
  return null;
};

// Safe float parser helper
const safeFloat = (val) => {
  if (val === null || val === undefined) return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

const MapView = ({
  center = null,
  zoom = 14,
  selectable = false,
  selectedLocation = null,
  searchedLocation = null,
  onLocationSelect = null,
  issues = [],
  showLiveUserLocation = true,
  className = "h-80 w-full",
}) => {
  const containerRef = useRef(null);
  const [activeProvider, setActiveProvider] = useState(MAP_TILE_PROVIDERS.standard);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

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
          setGpsError("Live GPS unavailable. Showing default location.");
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

  const handleRecenterToLiveGPS = useCallback(async () => {
    if (liveUserPos) {
      setManualCenter([liveUserPos.latitude, liveUserPos.longitude]);
      if (onLocationSelect) {
        let addr = `Lat: ${liveUserPos.latitude}, Lng: ${liveUserPos.longitude}`;
        const fetched = await reverseGeocode(liveUserPos.latitude, liveUserPos.longitude);
        if (fetched) addr = fetched;
        onLocationSelect({ ...liveUserPos, address: addr });
      }
    } else if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const loc = {
            latitude: parseFloat(pos.coords.latitude.toFixed(6)),
            longitude: parseFloat(pos.coords.longitude.toFixed(6)),
          };
          setLiveUserPos(loc);
          setManualCenter([loc.latitude, loc.longitude]);
          setIsLocating(false);
          if (onLocationSelect) {
            let addr = `Lat: ${loc.latitude}, Lng: ${loc.longitude}`;
            const fetched = await reverseGeocode(loc.latitude, loc.longitude);
            if (fetched) addr = fetched;
            onLocationSelect({ ...loc, address: addr });
          }
        },
        () => {
          setGpsError("Could not retrieve GPS location.");
          setIsLocating(false);
        }
      );
    }
  }, [liveUserPos, onLocationSelect]);

  // Determine bulletproof numeric map center
  const searchedLat = safeFloat(searchedLocation?.latitude);
  const searchedLng = safeFloat(searchedLocation?.longitude);

  const selectedLat = safeFloat(selectedLocation?.latitude);
  const selectedLng = safeFloat(selectedLocation?.longitude);

  const propCenterLat = safeFloat(center?.[0]);
  const propCenterLng = safeFloat(center?.[1]);

  const liveLat = safeFloat(liveUserPos?.latitude);
  const liveLng = safeFloat(liveUserPos?.longitude);

  const effectiveLat =
    safeFloat(manualCenter?.[0]) ??
    searchedLat ??
    selectedLat ??
    propCenterLat ??
    liveLat ??
    19.076; // Mumbai default fallback

  const effectiveLng =
    safeFloat(manualCenter?.[1]) ??
    searchedLng ??
    selectedLng ??
    propCenterLng ??
    liveLng ??
    72.8777;

  const effectiveCenter = [effectiveLat, effectiveLng];
  const effectiveZoom = searchedLocation ? 13 : zoom;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100"
      style={{ minHeight: "350px", height: "100%", width: "100%" }}
    >
      {/* Top Controls Overlay */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2">
        {/* Live GPS Re-center Button */}
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

        {/* Tile Layer Selector Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-md border border-slate-200 cursor-pointer"
            title="Change Map Style"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>{activeProvider.name}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 py-1.5 z-[1005] animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Select Map View
              </div>
              {Object.values(MAP_TILE_PROVIDERS).map((provider) => {
                const IconComp = provider.icon;
                const isSelected = activeProvider.id === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => {
                      setActiveProvider(provider);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center gap-2 hover:bg-indigo-50/70 transition ${
                      isSelected ? "text-indigo-600 font-bold bg-indigo-50/50" : "text-slate-700"
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                    <span>{provider.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

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

      <MapContainer
        center={effectiveCenter}
        zoom={effectiveZoom}
        scrollWheelZoom={true}
        className={className}
        style={{ height: "100%", width: "100%", minHeight: "350px", zIndex: 1 }}
      >
        <TileLayer
          key={activeProvider.id}
          attribution={activeProvider.attribution}
          url={activeProvider.url}
          subdomains={activeProvider.subdomains || "abc"}
          maxZoom={19}
          eventHandlers={{
            tileerror: (e) => {
              if (e.tile && !e.tile.dataset.retried) {
                e.tile.dataset.retried = "true";
                const coords = e.coords;
                e.tile.src = `https://tile.openstreetmap.org/${coords.z}/${coords.x}/${coords.y}.png`;
              }
            },
          }}
        />

        <MapResizeObserver containerRef={containerRef} />
        <RecenterMap center={effectiveCenter} zoom={effectiveZoom} />

        {selectable && <LocationPicker onLocationSelect={onLocationSelect} />}

        {/* Live User Location Marker */}
        {showLiveUserLocation && liveUserPos && liveLat !== null && liveLng !== null && (
          <>
            <Marker position={[liveLat, liveLng]} icon={createLiveUserIcon()}>
              <Popup>
                <div className="p-1 text-center">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full text-[10px] font-extrabold mb-1">
                    <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping"></span>
                    Your Live Position
                  </div>
                  <p className="font-extrabold text-xs text-slate-900">You Are Here</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Lat: {liveLat}, Lng: {liveLng}
                  </p>
                </div>
              </Popup>
            </Marker>

            {accuracy && (
              <Circle
                center={[liveLat, liveLng]}
                radius={accuracy}
                pathOptions={{ color: "#0284c7", fillColor: "#38bdf8", fillOpacity: 0.15, weight: 1.5 }}
              />
            )}
          </>
        )}

        {/* Searched City Location Marker */}
        {searchedLat !== null && searchedLng !== null && (
          <Marker position={[searchedLat, searchedLng]} icon={createSearchLocationIcon()}>
            <Popup>
              <div className="p-1 max-w-xs text-center">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-extrabold mb-1">
                  Searched Location
                </div>
                <p className="font-extrabold text-xs text-slate-900 line-clamp-2">
                  {searchedLocation.address || "Searched Position"}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Lat: {searchedLat}, Lng: {searchedLng}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Selected location pin (for location picking forms) */}
        {selectable && selectedLat !== null && selectedLng !== null && (
          <Marker position={[selectedLat, selectedLng]} icon={createCustomIcon("Selected")}>
            <Popup>
              <div className="p-1">
                <p className="font-bold text-xs text-slate-900">Selected Issue Location</p>
                {selectedLocation.address && (
                  <p className="text-xs text-slate-700 font-medium mt-0.5">{selectedLocation.address}</p>
                )}
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  Lat: {selectedLat}, Lng: {selectedLng}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Display issues markers */}
        {!selectable &&
          issues.map((issue) => {
            const issueLat = safeFloat(issue?.location?.latitude);
            const issueLng = safeFloat(issue?.location?.longitude);
            if (issueLat === null || issueLng === null) return null;
            return (
              <Marker
                key={issue._id || `${issueLat}-${issueLng}`}
                position={[issueLat, issueLng]}
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
