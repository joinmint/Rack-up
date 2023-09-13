const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  //Write to a loggin service so we have visibility outside of render
  //because render offers no loggin
  return res.status(400).send({ error: error.message });
};

module.exports = errorHandler;
