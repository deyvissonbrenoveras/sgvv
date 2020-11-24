import mongoose from 'mongoose';

const driverSchema = mongoose.Schema({
  name: { type: String, required: true },
  passwordHash: { type: String },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  },
});

export default mongoose.model('Driver', driverSchema);
