import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    duration: { type: Number, default: 30 }, // minutes
    published: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
  },
  { timestamps: true }
);

testSchema.pre("save", function (next) {
  if (this.startTime && this.duration) {
    const end = new Date(this.startTime);
    end.setMinutes(end.getMinutes() + this.duration);
    this.endTime = end;
  }
  next();
});

export default mongoose.model("Test", testSchema);
