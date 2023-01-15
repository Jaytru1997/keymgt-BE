exports.asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      // message: "Something happend, we are unable to process your request at this moment. Kindly click on the button below to restart the process.",
      next(err);
    }
  };
};
