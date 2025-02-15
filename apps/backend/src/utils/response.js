const createResponse = (res, statusCode, message, options = {}) => {
  const { data, errorType, errors } = options;

  const response = {
    status: statusCode < 400 ? "success" : "error",
    code: statusCode,
    message,
    ...(data && { data }),
    ...(errorType && { errorType }),
    ...(errors?.length && { errors }),
  };

  return res.status(statusCode).json(response);
};

const responseHandler = {
  success: (res, message = "Your request was processed successfully.", data) =>
    createResponse(res, 200, message, { data }),

  created: (res, message = "Your request was successful. The resource has been created.", data) =>
    createResponse(res, 201, message, { data }),

  badRequest: (res, message = "Invalid request. Some required parameters are missing or incorrect.", errors = []) =>
    createResponse(res, 400, message, { errors }),

  unauthorized: (res, message = "Authentication required. Please log in.", errorType = "AUTH_ERROR") =>
    createResponse(res, 401, message, { errorType }),

  forbidden: (res, message = "You do not have permission to access this resource.") =>
    createResponse(res, 403, message),

  sessionExpired: (res, message = "Your session has expired. Please log in again.") =>
    createResponse(res, 419, message),

  notFound: (res, message = "The requested resource could not be found.") => createResponse(res, 404, message),

  internalServerError: (res, message = "Something went wrong on our end.") => createResponse(res, 500, message),
};

export default responseHandler;
