
const { validationResult } = require("express-validator");
const Courses = require('../models/course.model');
const httpStatusText = require('../utility/httpStatusText')
const errorWrapper = require('../middlewares/errorWrapper.middleware');
const errorHelper = require('../utility/errorHelper');

const getAllCourses =  errorWrapper(async(req, res) => {
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;
  const skip = (page - 1) * limit;
  const course = await Courses.find({}, {__v: false}).limit(limit).skip(skip);
  res.status(200).json({status: httpStatusText.SUCCESS, data: {courses: course}});
});

const getSingleCourse  = errorWrapper(async(req, res, next) => {
  const courseId = req.params.courseId;
     const course = await Courses.findById(courseId);
  if (!course) {
    const error = errorHelper.create('Course not found', 404, httpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({status: httpStatusText.SUCCESS, data: {course}});
});

const addCourse = errorWrapper(async (req, res, next)=> {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const error = errorHelper.create(errors.array(), 400, httpStatusText.FAIL)
    return next(error);
  }
  
  const newCourse =  new Courses({...req.body});
  await newCourse.save();
  res.status(201).json({status: httpStatusText.SUCCESS, data: {course: newCourse}});


});

const updateCourse = errorWrapper(async (req, res, next)=> {
  const courseId = req.params.courseId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errorHelper.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }
      const updatedCourse = await Courses.findByIdAndUpdate(courseId, {$set: req.body}, { new: true});
  if (!updatedCourse) {
    const error = errorHelper.create('Course not found', 404, httpStatusText.FAIL);
    return next(error);
  }
    res.status(200).json({status: httpStatusText.SUCCESS, data: {course: updatedCourse} });
});

const deleteCourse = errorWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const deleteCourse = await Courses.findByIdAndDelete(courseId);
  if(!deleteCourse) {
    const error = errorHelper.create('Course not found', 404, httpStatusText.FAIL);
    return next(error);
   }
    res.status(200).json({status: httpStatusText.SUCCESS, data: null, message: 'Course deleted successfully'});
});


module.exports = {
  getAllCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse
};