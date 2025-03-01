import reviewModel from "../models/review.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";

export const addReview = async (req, res) => {
  const { billId, foodId, rating, comment } = req.body;
  const userId = req.userId;
  if (!billId || !rating || !comment) {
    return responseHandler.badRequest(res, "Please fill all fields");
  }
  try {
    const review_id = nanoidNumbersOnly();
    await reviewModel.addReview({
      review_id: review_id,
      bill_id: billId,
      user_id: userId,
      rating,
      comment,
    });
    return responseHandler.created(res, "Review added successfully");
  } catch (error) {
    console.error("Error adding review:", error);
    return responseHandler.internalServerError(res);
  }
};
