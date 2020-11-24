import mongoose from 'mongoose';

const fileSchema = mongoose.Schema(
  {
    filename: { type: String, required: true },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);
fileSchema.virtual('url').get(function () {
  return `${process.env.BASE_URL}/uploads/${this.filename}`;
});
export default mongoose.model('File', fileSchema);
