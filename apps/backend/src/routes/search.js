import { Router } from "express";
import * as searchController from "../controllers/search.js";
import { apiCache } from "../middlewares/apiCache.js";
const router = Router();

router.use("/search", apiCache, searchController.searchFood);

export default router;
