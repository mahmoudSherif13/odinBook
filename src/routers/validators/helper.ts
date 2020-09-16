import { validationResult } from "express-validator";
import { controllerFunction } from "../../controllers/helper/types";

export const validate: controllerFunction = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));

  res.status(400).json({
    errors: extractedErrors,
  });
};
