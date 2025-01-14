export const getLocations = async (locationQuery) => {
  const res = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/api/v1/location${locationQuery ? `?locationQuery=${locationQuery}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    
  );
  return await res.json();
};
