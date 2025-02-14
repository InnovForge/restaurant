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
  success: (res, message = "Success", data = null) => createResponse(res, 200, message, data),

  badRequest: (res, message = "Bad Request: The request contains invalid or missing parameters.", errors = []) =>
    createResponse(res, 400, message, null, null, errors),

  created: (res, message = "Resource created successfully.", data = null) => createResponse(res, 201, message, data),

  unauthorized: (res, message = "Unauthorized: Please log in to access this resource.", errorType) =>
    createResponse(res, 401, message, null, errorType),
  forbidden: (res, message = "Forbidden: You don't have permission to access this resource.") =>
    createResponse(res, 403, message),

  notFound: (res, message = "Not Found: The requested resource could not be found.") =>
    createResponse(res, 404, message),

  internalServerError: (res) => createResponse(res, 500, "Internal Server Error: Something went wrong on our end."),
};

export default responseHandler;
