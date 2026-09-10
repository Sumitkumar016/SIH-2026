/**
 * Formats Zod validation issues into a clean, easy-to-read array of field errors.
 * Example output: [{ field: "email", message: "Invalid email address" }]
 */
function formatValidationErrors(issues = []) {
  const formattedErrors = [];

  for (const issue of issues) {
    formattedErrors.push({
      field: issue.path.join("."),
      message: issue.message,
    });
  }

  return formattedErrors;
}

/**
 * Validation Middleware Factory:
 * Creates an Express middleware function that validates req.body against a provided Zod schema.
 * 
 * - If valid: replaces req.body with the sanitized/parsed data and calls next().
 * - If invalid: stops the request and sends a 400 Bad Request response with details.
 *
 * Example usage: router.post("/login", validate(loginSchema), loginController);
 */
function validate(schema) {
  return function (req, res, next) {
    // safeParse validates data without throwing an unhandled exception
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: formatValidationErrors(result.error.issues),
      });
    }

    // Replace req.body with the parsed/coerced data from Zod
    req.body = result.data;
    next();
  };
}

export default validate;
