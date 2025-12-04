import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Auto-approve admin users OR the very first user (convenience)
    const isFirstUser = (await User.countDocuments()) === 0;
    const shouldAutoApprove = role === "admin" || isFirstUser;

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      status: shouldAutoApprove ? "approved" : "pending",
    });

    // Do NOT return token if user is pending (we want admin approval first)
    if (user.status === "pending") {
      return res.status(201).json({ message: "Registered successfully. Awaiting admin approval." });
    }

    // approved user (admin or first user) -> return token
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      message: "Registered and approved",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Registration error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🔥 BLOCK NON-ADMIN PENDING USERS
    if (user.role !== "admin" && user.status === "pending") {
      return res.status(403).json({
        message: "Your account is pending approval by admin.",
      });
    }

    // 🔥 BLOCK NON-ADMIN REJECTED USERS
    if (user.role !== "admin" && user.status === "rejected") {
      return res.status(403).json({
        message: "Your account was rejected by admin.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
