import mongoose from 'mongoose';

const tripSchema = mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  departureLocation: {
    name: { type: String },
    latLon: { type: Array },
  },
  arrivalLocation: {
    name: { type: String },
    latLon: { type: Array },
  },
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
