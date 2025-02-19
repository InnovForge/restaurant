import { redisApiCache } from "../configs/redis.js";
import responseHandler from "../utils/response.js";

const apiCache = (req, res, next) => {
  const key = req.originalUrl;
  // console.log("key :>> ", key);

  redisApiCache.get(key).then((cachedData) => {
    if (cachedData) {
      return responseHandler.success(res, undefined, JSON.parse(cachedData));
    }
    console.log("No cached data");
    next();
  });
};

const cacheResponse = (key, data, ttl = 60) => {
  redisApiCache.setex(key, ttl, JSON.stringify(data));
};

export { apiCache, cacheResponse };
