import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema({
  description: { type: String, required: true },
  model: { type: String },
  manufacturingYear: { type: Number },
  brand: { type: String, required: true },
  paintColor: { type: String },
  licensePlate: { type: String },
  active: { type: Boolean, default: true },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  },
});

export default mongoose.model('Vehicle', vehicleSchema);
