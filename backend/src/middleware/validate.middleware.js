const formatValidationErrors = (issues = []) => {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

// validate receives a schema and checks req.body before the controller runs.
// If validation passes, req.body is replaced with the cleaned/parsed data.
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: formatValidationErrors(result.error.issues),
      });
    }

    req.body = result.data;
    next();
  };
};

export default validate;
