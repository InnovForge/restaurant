import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";
import * as searchService from "../services/search.js";
import SearchHistoryModel from "../models/search_history.js";
import { cacheResponse } from "../middlewares/apiCache.js";

export const searchFood = async (req, res) => {
  const { latitude, longitude, radius, limit = 10, offset, query, type = "*" } = req.query;
  const errors = validateFields(
    req.query,
    ["latitude", "longitude", "offset", "limit", "query", "radius", "type"],
    ["query"],
  );

  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    let responseData = {};

    switch (type) {
      case "*": {
        const [foods, restaurants] = await Promise.all([
          searchService.searchFoodNearby(latitude, longitude, radius, limit, offset, query),
          searchService.searchRestaurantNearby(latitude, longitude, radius, limit, offset, query),
        ]);

        responseData = { foods, restaurants };
        break;
      }

      case "restaurants":
        responseData.restaurants = await searchService.searchRestaurantNearby(
          latitude,
          longitude,
          radius,
          limit,
          offset,
          query,
        );
        break;

      default:
        return responseHandler.badRequest(res, "Invalid type parameter");
    }
    cacheResponse(req.originalUrl, responseData, 60); // 1 minute
    return responseHandler.success(res, undefined, responseData);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const saveSearchHistory = async (req, res) => {
  const { query } = req.body;
  const errors = validateFields(req.body, ["query"]);
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }
  try {
    await SearchHistoryModel.saveSearchHistory(req.userId, query);
    return responseHandler.created(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getSearchHistory = async (req, res) => {
  try {
    const searchHistory = await SearchHistoryModel.getSearchHistory(req.userId);
    return responseHandler.success(res, undefined, searchHistory);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const deleteSearchHistory = async (req, res) => {
  const { id } = req.params;
  try {
    await SearchHistoryModel.deleteSearchHistory(req.userId, id);
    return responseHandler.success(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const suggestSearch = async (req, res) => {
  const { query } = req.query;
  const errors = validateFields(req.query, ["query"], true);
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    const suggestions = await SearchHistoryModel.suggestSearchHistory(query);
    return responseHandler.success(res, undefined, suggestions);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};
