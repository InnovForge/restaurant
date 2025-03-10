import billModel from "../models/bill.js";
import responseHandler from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";

export const createBill = async (req, res) => {
  const { restaurantId } = req.params;
  const {
    userId,
    orderStatus,
    reservationId,
    paymentMethod,
    paymentStatus,
    items, // Danh sách các món ăn trong hóa đơn
  } = req.body;

  // Kiểm tra các trường bắt buộc
  const errors = validateFields(req.body, ["userId", "orderStatus", "paymentMethod", "paymentStatus", "items"], true);
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    // Gọi model để tạo hóa đơn
    const { success, billId, message } = await billModel.createBill({
      restaurant_id: restaurantId,
      user_id: userId,
      order_status: orderStatus,
      reservation_id: reservationId,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      items,
    });

    if (success) {
      return responseHandler.created(res, "Bill created successfully", { billId });
    } else {
      return responseHandler.badRequest(res, message || "Failed to create bill");
    }
  } catch (error) {
    console.error("Error creating bill:", error);
    return responseHandler.internalServerError(res);
  }
};

export const loadBill = async (req, res) => {
  const { billId } = req.params;

  try {
    // Gọi model để lấy thông tin hóa đơn
    const { success, bill, message } = await billModel.loadBill(billId);

    if (success) {
      return responseHandler.success(res, "Bill loaded successfully", { bill });
    } else {
      return responseHandler.notFound(res, message || "Bill not found");
    }
  } catch (error) {
    console.error("Error loading bill:", error);
    return responseHandler.internalServerError(res);
  }
};

export const loadBillItem = async (req, res) => {
  const { billId } = req.params;

  try {
    // Gọi model để lấy danh sách các mục hóa đơn
    const { success, billItems, message } = await billModel.loadBillItem(billId);

    if (success) {
      return responseHandler.success(res, "Bill items loaded successfully", { billItems });
    } else {
      return responseHandler.notFound(res, message || "Bill items not found");
    }
  } catch (error) {
    console.error("Error loading bill items:", error);
    return responseHandler.internalServerError(res);
  }
};

export const getBillById = async (req, res) => {
  const { billId } = req.params;

  try {
    // Gọi model để lấy thông tin hóa đơn
    const bill = await billModel.getBillById(billId);

    return responseHandler.success(res, "Bill loaded successfully", { bill });
  } catch (error) {
    console.error("Error loading bill:", error);
    return responseHandler.internalServerError(res);
  }
};
