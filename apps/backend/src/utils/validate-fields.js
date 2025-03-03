function validateFields(fields, validFields, requiredFields = []) {
  const errors = [];
  const validSet = new Set(validFields);
  const fieldKeys = Object.keys(fields);

  const requiredSet =
    requiredFields === true ? validSet : requiredFields === false ? new Set() : new Set(requiredFields);

  for (const field of fieldKeys) {
    if (!validSet.has(field)) {
      errors.push({ field, message: `${capitalize(field)} is not allowed` });
    }
  }

  for (const field of requiredSet) {
    if (!(field in fields) || fields[field] === "") {
      errors.push({ field, message: `${capitalize(field)} is required` });
    }
  }

  return errors.length ? errors : null;
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export { validateFields };
