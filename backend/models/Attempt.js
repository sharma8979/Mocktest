import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  selectedOptionId: String,
  correct: Boolean,
  marksAwarded: Number
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [answerSchema],
  totalMarks: { type: Number, default: 0 },
  startedAt: Date,
  finishedAt: Date,
  status: { type: String, enum: ['in_progress','submitted'], default: 'in_progress' }
}, { timestamps: true });

export default mongoose.model('Attempt', attemptSchema);
