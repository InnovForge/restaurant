function validateFields(fields, optionalFields = []) {
  const errors = [];

  Object.keys(fields).forEach((field) => {
    if (!optionalFields.includes(field) && !fields[field]) {
      errors.push({
        field,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
      });
    }
  });

  return errors.length > 0 ? errors : null;
}
export { validateFields };
