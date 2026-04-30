const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const collegeRoutes = require("./routes/colleges");
const compareRoutes = require("./routes/compare");
const savedRoutes = require("./routes/saved");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
};

const parseOrigins = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

const allowedOrigins = parseOrigins(
  process.env.CORS_ORIGIN || process.env.CORS_ORIGINS
);

const corsOptions =
  allowedOrigins.length > 0
    ? {
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          const normalized = normalizeOrigin(origin);
          return callback(null, allowedOrigins.includes(normalized));
        }
      }
    : { origin: "*" };

app.use(express.json({ limit: "1mb" }));
app.use(cors(corsOptions));
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/compare", compareRoutes);
app.use("/api/saved", savedRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
