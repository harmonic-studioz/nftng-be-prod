const errorHandler = async (error, req, res, next) => {
  error && res.status(error.status || 500).send(error);
};

module.exports = errorHandler;
