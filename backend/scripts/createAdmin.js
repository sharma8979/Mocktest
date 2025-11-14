import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db.js';
import User from '../models/User.js';

const run = async () => {
  try {
    await connectDB();
    const email = 'admin@example.com';
    const existing = await User.findOne({ email });
    if (existing) {
      existing.role = 'admin';
      await existing.save();
      console.log('Updated existing user to admin:', email);
      process.exit(0);
    }
    const user = await User.create({ name: 'Admin', email, password: 'Admin@123', role: 'admin' });
    console.log('Created admin user:', user.email, 'password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
