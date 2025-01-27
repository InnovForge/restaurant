export const contRoute = async (waypoints) => {
  const response = await fetch(
    `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=scooter&apiKey=${process.env.GEOAPIFY_API_KEY}`,
  );
  const data = await response.json();
  return {
    distance: data.features[0].properties.distance,
    distance_units: data.features[0].properties.distance_units,
    duration: data.features[0].properties.time / 60,
    duration_units: "minutes",
  };
};
