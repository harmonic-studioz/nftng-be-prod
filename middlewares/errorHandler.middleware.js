const errorHandler = async (error, req, res, next) => {
  if (error) {
    res.status(error.status || 500).send(error);
    console.log(error);
  }
};

module.exports = errorHandler;
