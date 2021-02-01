import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

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
fileSchema.plugin(mongooseLeanVirtuals);

export default mongoose.model('File', fileSchema);
