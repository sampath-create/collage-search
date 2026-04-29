const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const user = new User({ name, email: email.toLowerCase() });
    await user.setPassword(password);
    await user.save();
    const token = createToken(user.id);
    return res.status(201).json({ data: { user, token } });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash"
    );
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = await user.validatePassword(password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = createToken(user.id);
    return res.json({ data: { user: user.toJSON(), token } });
  } catch (err) {
    return next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ data: user });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login, me };
