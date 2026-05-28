import mongoose, { Document } from "mongoose";

// Interface ko strictly batao ke undefined accept karna hi parega!
interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  refreshtokenHash: string;
  ip: string | undefined;          
  userAgent: string | unknown;   
  revoked: boolean;
}

const sessionSchema = new mongoose.Schema<ISession>({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users",
    required: [true, "user is required"]
  },
  refreshtokenHash: {
    type: String,
    required: [true, "Refresh token Hash is Required"]
  },
  ip: {
    type: String,
    default: "" 
  },
  userAgent: {
    type: String,
    default: ""
  },
  revoked: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const sessionModel = mongoose.model<ISession>("session", sessionSchema);

export default sessionModel;