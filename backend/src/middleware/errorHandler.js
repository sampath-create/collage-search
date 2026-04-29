const notFoundHandler = (req, res) => {
  res.status(404).json({ error: "Not found" });
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }
  res.status(status).json({ error: message });
};

module.exports = { notFoundHandler, errorHandler };
