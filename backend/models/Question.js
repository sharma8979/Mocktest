import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  _id: false,
  id: { type: String, required: true }, // simple id for option (e.g., "A","B" or uuid)
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['mcq','truefalse','descriptive'], default: 'mcq' },
  options: [optionSchema], // if MCQ/truefalse
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
