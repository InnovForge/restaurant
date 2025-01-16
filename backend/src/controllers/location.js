const processLocationResults = (data) => {
  if (!data?.results || data.results.length === 0) {
    return [];
  }
  return data.results.map((result) => ({
    name: result.formatted,
    state: result.state,
    latitude: result.lat,
    longitude: result.lon,
    importance: result.rank.importance,
    confidence: result.rank.confidence,
    bbox: result.bbox,
  }));
};

export const searchLocation = async (req, res) => {
  const { locationQuery, latitude, longitude } = req.query;
  let bias = null;
  if (latitude && longitude) {
    bias = `&bias=circle:${longitude},${latitude},3000|countrycode:vn`;
  }

  console.log(locationQuery, latitude, longitude);
  const URL = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationQuery)}&filter=countrycode:vn${bias ? bias : ""}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;

  console.log(URL);
  try {
    const response = await fetch(URL);

    const data = await response.json();
    const locations = processLocationResults(data);
    // console.log(encodedString);
    return res.status(200).json({ locations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
