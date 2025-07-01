const express = require("express");
const coursesController = require("../controllers/courses.controller");
const { updateCourseMiddleware, addCourseMiddleware } = require("../middlewares/courses.middleware");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const roles = require("../utility/roles");

const router = express.Router();

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(
    verifyToken,
    allowedTo(roles.ADMIN),
    addCourseMiddleware(),
    coursesController.addCourse
  );

router
  .route("/:courseId")
  .get(coursesController.getSingleCourse)
  .put(
    verifyToken,
    updateCourseMiddleware()
    ,
    coursesController.updateCourse
  )
  .delete(verifyToken, allowedTo(roles.ADMIN),coursesController.deleteCourse);


module.exports = router;
