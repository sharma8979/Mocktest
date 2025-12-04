import User from "../models/User.js";

export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "pending" }).select("-password");
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { status: "approved" }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User approved", user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
