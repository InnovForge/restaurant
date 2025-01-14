import removeAccents from "remove-accents";
const processLocationResults = (data) => {
  if (!data?.results || data.results.length === 0) {
    return [];
  }
  return data.results.map((result) => ({
    name: result.formatted,
    latitude: result.lat,
    longitude: result.lon,
    importance: result.rank.importance,
    confidence: result.rank.confidence,
    bbox: result.bbox,
  }));
};

export const searchLocation = async (req, res) => {
  const { locationQuery } = req.query;
  console.log(locationQuery);
  try {
    const encodedString = encodeURIComponent(removeAccents(locationQuery));
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodedString}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`,
    );
    const data = await response.json();
    const locations = processLocationResults(data);
    // console.log(encodedString);
    return res.status(200).json({ locations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
