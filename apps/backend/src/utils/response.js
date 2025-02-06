function createResponse(res, statusCode, message, data = null, errorType = null, errors = []) {
  const response = {
    status: statusCode < 400 ? "success" : "error",
    code: statusCode,
    message,
  };

  if (data) response.data = data;
  if (errorType) response.errorType = errorType;
  if (errors.length > 0) response.errors = errors;

  return res.status(statusCode).json(response);
}

const responseHandler = {
  /**
   * @param {Object} res - Express response object
   * @param {String} message - Message to be sent in the response
   * */
  success: (res, message, data = null) => createResponse(res, 200, message, data),

  /**
   * @param {Object} res - Express response object
   * @param {String} message - Message to be sent in the response
   * @param {Array} errors - Array of error messages
   */
  badRequest: (res, message, errors = []) => createResponse(res, 400, message, null, null, errors),

  created: (res, message, data = null) => createResponse(res, 201, message, data),
  unauthorized: (res, message, errorType) => createResponse(res, 401, message, null, errorType),
  forbidden: (res, message) => createResponse(res, 403, message),
  notFound: (res, message) => createResponse(res, 404, message),
  internalServerError: (res, message) => createResponse(res, 500, message),
};

export default responseHandler;
