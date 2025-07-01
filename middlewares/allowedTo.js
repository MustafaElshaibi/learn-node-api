const errorHelper = require("../utility/errorHelper");
const httpStatusText = require('../utility/httpStatusText');


module.exports = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      const error = errorHelper.create(
        `You are not allowed to access this resource. Required roles: ${roles.join(
          ", "
        )}`,
        403,
        httpStatusText.ERROR
      );
      return next(error);
    }
    next();
  };
};
