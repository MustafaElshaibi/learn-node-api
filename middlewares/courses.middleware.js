const { body } = require("express-validator");

const updateCourseMiddleware = () => {
  return [
      body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 2 })
        .withMessage("Title must be at least 2 characters long")
        .optional(),
      body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number")
        .optional(),
    ]
}


const addCourseMiddleware = () => {
  return [
        body("title")
          .notEmpty()
          .withMessage("Title is required")
          .isLength({ min: 2 })
          .withMessage("Title must be at least 2 characters long"),
        body("price")
          .notEmpty()
          .withMessage("Price is required")
          .isNumeric()
          .withMessage("Price must be a number"),
      ]
}

module.exports = {
  updateCourseMiddleware,
  addCourseMiddleware
  };