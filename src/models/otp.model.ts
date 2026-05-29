import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({

  email: { type: String,required: [true, 'Email is required'],},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User ID is required'] },
  otpHash: { type: String, required: [true, 'OTP is required'] },
},
{ timestamps: true }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const otpModel = mongoose.model("otps", otpSchema);

export default otpModel;