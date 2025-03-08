import { Router } from "express";
import user from "./user.js";
import restaurant from "./restaurant.js";
import geocode from "./geocode.js";
import auth from "./auth.js";
import payment from "./payment.js";
import food from "./food.js";
import bill from "./bill.js";
import reservation from "./reservation.js";
import review from "./review.js";
import table from "./table.js";
import search from "./search.js";

const router = Router();

router.use("/v1", auth);
router.use("/v1", user);
router.use("/v1", geocode);
router.use("/v1", payment);
router.use("/v1", restaurant);
router.use("/v1", food);
router.use("/v1", bill);
router.use("/v1", reservation);
router.use("/v1", review);
router.use("/v1", table);
router.use("/v1", search);

export default router;
