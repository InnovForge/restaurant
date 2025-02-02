const getCurrentLocation = () =>
  new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      (error) => {
        console.error("Geolocation error:", error);
        resolve(null); // Resolve with null if location access is denied or an error occurs
      },
    );
  });

export const getGeocode = async (q) => {
  const location = await getCurrentLocation();
  const params = new URLSearchParams({ q });

  if (location) {
    params.append("latitude", location.latitude);
    params.append("longitude", location.longitude);
  }

  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/geocode?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }

  return response.json();
};

export const getReverseGeocode = async () => {
  let lat = null;
  let lng = null;
  const location = await getCurrentLocation();
  if (location) {
    lat = location.latitude;
    lng = location.longitude;
  }

  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/api/v1/revgeocode?latitude=${lat}&longitude=${lng}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }

  return response.json();
};
