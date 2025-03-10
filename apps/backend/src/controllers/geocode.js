import { cacheResponse } from "../middlewares/apiCache.js";
import * as service from "../services/geocode.js";
import { logger } from "../utils/logger.js";
import responseHandler from "../utils/response.js";

const processLocationResults = (data) => {
  if (!data?.results || data.results.length === 0) {
    return [];
  }
  return data.results.map((result) => ({
    formatted: result.formatted,
    addressLine1: result.address_line1,
    addressLine2: result.address_line2,
    country: result.country,
    country_code: result.country_code,
    city: result.city,
    timezone: result.timezone,
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
    // console.log(data);
    const locations = processLocationResults(data);
    cacheResponse(req.originalUrl, locations, 7 * 24 * 60 * 60); // 7 days
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
    cacheResponse(req.originalUrl, locations[0], 7 * 24 * 60 * 60); // 7 days
    return responseHandler.success(res, undefined, locations[0]);
  } catch (error) {
    console.log("error :>> ", error);
    responseHandler.internalServerError(res);
  }
};

export const ipGeocode = async (req, res) => {
  const url = `https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.GEOAPIFY_API_KEY}`;

  try {
    // Fetch and parse the response
    const response = await fetch(url);
    const data = await response.json();

    // Destructure and prepare the response data
    const locationData = {
      formatted: data.state.name,
      state: data.state.name,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    };

    // Return the location data
    return responseHandler.success(res, undefined, locationData);
  } catch (error) {
    // Log the error and send an internal server error response
    console.error("Error fetching geolocation data:", error);
    return responseHandler.internalServerError(res);
  }
};

export const distance = async (req, res) => {
  const { waypoints } = req.query;
  const data = await service.distance(waypoints);
  cacheResponse(req.originalUrl, data, 7 * 24 * 60 * 60); // 7 days
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
