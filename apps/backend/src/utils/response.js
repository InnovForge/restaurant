/**
 * @param {number} statusCode - Mã trạng thái HTTP
 * @param {string} message - Thông báo phản hồi
 * @param {object|null} [data=null] - Dữ liệu trả về (nếu có)
 * @param {Array} [errors=[]] - Danh sách lỗi (nếu có)
 * @returns {object}
 */
function createResponse(res, statusCode, message, data = null, errors = []) {
  const response = {
    status: statusCode < 400 ? "success" : "error",
    code: statusCode,
    message,
  };

  if (data) response.data = data;
  if (errors.length > 0) response.errors = errors;

  res.status(statusCode).json(response);
}

/**
 * Phản hồi OK (HTTP 200)
 * @param {string} message - Thông báo thành công
 * @param {object|null} [data=null] - Dữ liệu trả về (nếu có)
 * @returns {object}
 */
export function success(res, message, data = null) {
  return createResponse(res, 200, message, data);
}

/**
 * Phản hồi Bad Request (HTTP 400)
 * @param {string} message - Thông báo lỗi
 * @param {Array} errors - Danh sách lỗi (nếu có)
 * @returns {object}
 */
export function badRequest(res, message, errors = []) {
  return createResponse(res, 400, message, null, errors);
}

/**
 * Phản hồi Not Found (HTTP 404)
 * @param {string} message - Thông báo lỗi
 * @returns {object}
 */
export function notFound(res, message) {
  return createResponse(res, 404, message);
}

/**
 * Phản hồi Internal Server Error (HTTP 500)
 * @param {string} message - Thông báo lỗi
 * @returns {object}
 */
export function internalServerError(res, message) {
  return createResponse(res, 500, message);
}
