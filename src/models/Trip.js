import mongoose from 'mongoose';

const tripSchema = mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date },
  departureLocation: { type: Array },
  arrivalLocation: { type: Array },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  amount: { type: Number, required: true, default: 0 },
  amountSpent: { type: Number },
  finished: { type: Boolean, default: false },
});

export default mongoose.model('Trip', tripSchema);
