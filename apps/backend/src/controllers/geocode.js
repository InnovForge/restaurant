import * as service from "../services/geocode.js";
import { logger } from "../utils/logger.js";
import responseHandler from "../utils/response.js";

const processLocationResults = (data) => {
  if (!data?.results || data.results.length === 0) {
    return [];
  }
  return data.results.map((result) => ({
    title: result.formatted,
    state: result.state,
    latitude: result.lat,
    longitude: result.lon,
    importance: result.rank.importance,
    confidence: result.rank.confidence,
    bbox: result.bbox,
  }));
};

export const geocode = async (req, res) => {
  const { q, latitude, longitude } = req.query;

  let bias = "";
  if (latitude && longitude) {
    bias = `&bias=circle:${longitude},${latitude},3000|countrycode:vn`;
  }
  const URL = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(q)}&filter=countrycode:vn${bias}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;
  // logger.info("Geoapify Geocode URL:", URL);
  try {
    const data = await (await fetch(URL)).json();
    const locations = processLocationResults(data);
    return responseHandler.success(res, undefined, locations);
  } catch (error) {
    logger.error("Error during geocoding:", error);
    return responseHandler.internalServerError(res);
  }
};

export const revGeocode = async (req, res) => {
  const { latitude, longitude } = req.query;
  const URL = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;
  logger.info(URL);
  try {
    const data = await (await fetch(URL)).json();
    const locations = processLocationResults(data);
    return responseHandler.success(res, undefined, locations);
  } catch (error) {
    console.log("error :>> ", error);
    responseHandler.internalServerError(res);
  }
};

// TODO: this is test func route
export const countRoute = async (req, res) => {
  const { waypoints } = req.query;
  const data = await service.countRoute(waypoints);
  return responseHandler.success(res, undefined, data);
};

/* // HERE MAPS
// 1000 requests per day
export const searchLocationHere = async (req, res) => {
  const { locationQuery, latitude, longitude } = req.query;
  let bias = null;
  if (latitude && longitude) {
    bias = `&at=${latitude},${longitude}`;
  }

  console.log(locationQuery, latitude, longitude);
  const URL = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(locationQuery)}&apiKey=${process.env.HERE_API_KEY}${bias ? bias : ""}`;

  console.log(URL);
  try {
    const r = await fetch(URL);

    const data = await r.json();
    // const locations = data;
    // console.log(locations);
    // console.log(encodedString);
    // return response.success(res, "Locations found", data.items);
    // return res.status(200).json({ locations: data.items });
    return response.success(res, "Locations found", { locations: data.items });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}; */
