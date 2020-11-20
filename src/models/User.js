import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String },
    active: { type: Boolean, default: true },
    privilege: { type: Number, default: 1 },
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
userSchema.virtual('password').set(function (password) {
  this.passwordHash = bcrypt.hashSync(password);
});
userSchema.methods.isAdmin = function () {
  if (this.privilege === 0) {
    return true;
  }
  return false;
};
export default mongoose.model('User', userSchema);
