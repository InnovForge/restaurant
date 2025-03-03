import { Router } from "express";
import * as tableController from "../controllers/table.js";
import { authRestaurant, ROLE } from "../middlewares/roleRestaurant.js";
import { authenticateJWT } from "../middlewares/authenticate.js";
import multer from "multer";
import { ro } from "@faker-js/faker";
// import tableModel from "../models/table.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.use("/tables", authenticateJWT);
router.post("/tables/:restaurantId/create", tableController.createTables);
router.get("/tables/:restaurantId", tableController.getTables);

export default router;
