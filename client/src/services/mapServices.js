// High-Availability Geocoding & Map Service with Multi-Provider Fallbacks

// Pre-cached major cities for instant offline / fallback search
export const MAJOR_INDIAN_CITIES = [
  { id: "local-mumbai", name: "Mumbai, Maharashtra, India", shortName: "Mumbai", lat: 19.076, lon: 72.8777 },
  { id: "local-delhi", name: "New Delhi, Delhi, India", shortName: "New Delhi", lat: 28.6139, lon: 77.209 },
  { id: "local-bengaluru", name: "Bengaluru, Karnataka, India", shortName: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { id: "local-hyderabad", name: "Hyderabad, Telangana, India", shortName: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { id: "local-ahmedabad", name: "Ahmedabad, Gujarat, India", shortName: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { id: "local-chennai", name: "Chennai, Tamil Nadu, India", shortName: "Chennai", lat: 13.0827, lon: 80.2707 },
  { id: "local-kolkata", name: "Kolkata, West Bengal, India", shortName: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { id: "local-pune", name: "Pune, Maharashtra, India", shortName: "Pune", lat: 18.5204, lon: 73.8567 },
  { id: "local-[#indore]", name: "Indore, Madhya Pradesh, India", shortName: "Indore", lat: 22.7196, lon: 75.8577 },
  { id: "local-bhopal", name: "Bhopal, Madhya Pradesh, India", shortName: "Bhopal", lat: 23.2599, lon: 77.4126 },
  { id: "local-jaipur", name: "Jaipur, Rajasthan, India", shortName: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { id: "local-surat", name: "Surat, Gujarat, India", shortName: "Surat", lat: 21.1702, lon: 72.8311 },
];

/**
 * Reverse Geocode coordinates to human-readable address
 * Provider Priority: Photon API -> Nominatim OpenStreetMap API -> Fallback string
 */
export const reverseGeocode = async (latitude, longitude) => {
  if (!latitude || !longitude) return "";

  // Provider 1: Photon API
  try {
    const res = await fetch(
      `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`,
      { headers: { Accept: "application/json" } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        const props = data.features[0].properties || {};
        const parts = [
          props.name,
          props.street,
          props.district,
          props.city || props.town,
          props.state,
          props.country,
        ].filter(Boolean);
        if (parts.length > 0) {
          return parts.join(", ");
        }
      }
    }
  } catch (err) {
    console.warn("Photon reverse geocode failed, trying Nominatim fallback...", err);
  }

  // Provider 2: Nominatim OpenStreetMap API
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    }
  } catch (err) {
    console.warn("Nominatim reverse geocode failed:", err);
  }

  return `Lat: ${latitude}, Lng: ${longitude}`;
};

/**
 * Forward Geocode location query to list of suggestions
 * Provider Priority: Local Matches -> Photon API -> Nominatim OpenStreetMap API
 */
export const searchLocations = async (queryText) => {
  if (!queryText || queryText.trim().length === 0) return [];
  const query = queryText.trim().toLowerCase();

  // Local static city matches
  const localMatches = MAJOR_INDIAN_CITIES.filter(
    (c) =>
      c.shortName.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query)
  ).map((c, idx) => ({ ...c, id: `local-${idx}` }));

  // Provider 1: Photon API
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        const apiResults = data.features.map((f) => {
          const props = f.properties || {};
          const coords = f.geometry?.coordinates || [0, 0];
          const shortName = props.name || props.city || props.country || "Location";
          const fullName = [props.name, props.city, props.state, props.country]
            .filter(Boolean)
            .join(", ");
          return {
            id: `photon-${coords[1]}-${coords[0]}`,
            name: fullName || shortName,
            shortName: shortName,
            lat: coords[1],
            lon: coords[0],
          };
        });

        const combined = [...localMatches];
        apiResults.forEach((item) => {
          if (!combined.some((c) => c.shortName.toLowerCase() === item.shortName.toLowerCase())) {
            combined.push(item);
          }
        });

        return combined.slice(0, 6);
      }
    }
  } catch (err) {
    console.warn("Photon forward search failed, trying Nominatim fallback:", err);
  }

  // Provider 2: Nominatim API
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const apiResults = data.map((item) => ({
          id: `nominatim-${item.place_id}`,
          name: item.display_name,
          shortName: item.display_name.split(",")[0],
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }));

        const combined = [...localMatches];
        apiResults.forEach((item) => {
          if (!combined.some((c) => c.shortName.toLowerCase() === item.shortName.toLowerCase())) {
            combined.push(item);
          }
        });

        return combined.slice(0, 6);
      }
    }
  } catch (err) {
    console.warn("Nominatim forward search failed:", err);
  }

  return localMatches.slice(0, 6);
};
