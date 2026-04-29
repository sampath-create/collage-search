const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const { connectDb } = require("../src/config/db");
const College = require("../src/models/College");

dotenv.config();

const run = async () => {
  const filePath = path.join(__dirname, "..", "data", "colleges.seed.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const colleges = JSON.parse(raw);

  await connectDb(process.env.MONGODB_URI);
  await College.deleteMany({});
  await College.insertMany(colleges);

  console.log(`Seeded ${colleges.length} colleges.`);
  await mongoose.connection.close();
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
