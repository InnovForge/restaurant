import { Router } from "express";
import * as searchController from "../controllers/search.js";
import { apiCache } from "../middlewares/apiCache.js";
import { authenticateJWT } from "../middlewares/authenticate.js";
const router = Router();

router.get("/search", apiCache, searchController.searchFood);
router.post("/search-history", authenticateJWT, searchController.saveSearchHistory);
router.get("/search-history", authenticateJWT, searchController.getSearchHistory);
router.delete("/search-history/:id", authenticateJWT, searchController.deleteSearchHistory);
router.get("/search-suggest", searchController.suggestSearch);

export default router;
