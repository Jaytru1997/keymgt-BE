exports.createRes = (obj, statusCode, res) => {
  res.status(statusCode).json({
    status: "success",
    data: { obj },
  });
};
