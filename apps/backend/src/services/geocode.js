import { redisApiCache } from "../configs/redis.js";
import { cacheResponse } from "../middlewares/apiCache.js";

export const distance = async (waypoints) => {
  const key = "distance:" + waypoints;
  const cachedData = await redisApiCache.get(key);

  if (cachedData) {
    // console.log("found cache", cachedData);
    return JSON.parse(cachedData);
  } else {
    console.log("can't find cache for", key);
    const response = await fetch(
      `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=scooter&apiKey=${process.env.GEOAPIFY_API_KEY}`,
    );
    const data = await response.json();
    // console.log(waypoints);
    //
    if (data?.features?.length > 0) {
      const distance = {
        distance: data.features[0].properties.distance,
        distance_units: data.features[0].properties.distance_units,
        duration: data.features[0].properties.time / 60,
        duration_units: "minutes",
      };
      cacheResponse(key, distance, 7 * 24 * 60 * 60); // 7 days
      return distance;
    } else {
      // console.error("No route found:", data);
      return {
        distance: 0,
        distance_units: "meters",
        duration: 0,
        duration_units: "minutes",
      };
    }
  }
};
