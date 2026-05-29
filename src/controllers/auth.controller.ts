import {type Request, type Response} from "express";
import User from "../models/user.model.js";
import crypto from "crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../services/sendemail.service.js";
import { genrateOtp, getOtp } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";


export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await User.findOne({ 

    $or:[
      {username},
      {email}
    ]
   });

   if(isAlreadyRegistered){
   return res.status(400).json({
      message: "User already exists with the provided username or email",
      success: false
    })
   }

   const hasedpassword = crypto.createHash("sha256").update(password).digest("hex");

   const user = await User.create({
    username,
    email,
    password:hasedpassword
   })

   const otp = genrateOtp();
   const html = getOtp(otp);

   const otpHash = crypto.createHash("sha256").update(otp.toString()).digest("hex");

   await otpModel.create({
    email,
    user: user._id,
    otpHash
   })

   await sendEmail({
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for email verification is: ${otp}`,
    html
   });

res.status(201).json({
    message: "User registered successfully",
    success: true,
    user:{
      username:user.username,
      email:user.email,
      verified:user.verified
    }
  });

}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false
    });
  }

  if(!user.verified){
    return res.status(401).json({
      message: "Email not verified. Please verify your email before logging in.",
      success: false
    });
  }

  const hasedpassword = crypto.createHash("sha256").update(password).digest("hex");

  const isPasswordValid = hasedpassword === user.password;

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false
    });
  }

  const refreshtoken = jwt.sign(
    { id: user._id },
    config.Jwt,
    { expiresIn: "7d" }
  );

  const refreshTokenHash = crypto.createHash("sha256").update(refreshtoken).digest("hex");

  const session = await sessionModel.create({
    user: user._id,
    refreshtokenHash: refreshTokenHash,
    ip: req.ip,
    userAgent: req.get("User-Agent") 
  });

  const accesstoken = jwt.sign(
    { id: user._id, sessionId: session._id },
    config.Jwt,
    { expiresIn: "15m" }
  );

  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });

  res.status(200).json({
    message: "Login successful",
    success: true,
    accesstoken
  });

}

export async function getMe(req: Request, res: Response) {
  
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ 
      message: "No token provided, access denied", 
      success: false 
    });
  }

  try {
    
    const decoded = jwt.verify(token, config.Jwt) as JwtPayload & { id: string };
    
   
    const user = await User.findById(decoded.id); 

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email
      }
    }); 

  } catch (error) {
    return res.status(401).json({ 
      message: "Invalid or expired token", 
      success: false 
    });
  }
}
 
export async function refreshtoken(req: Request, res: Response) {

  const refreshtoken = req.cookies.refreshtoken;

  if (!refreshtoken) {

    return res.status(401).json({

      message: "Refresh token not found",

      success: false

    });

  }

  try {
    const decoded = jwt.verify(refreshtoken, config.Jwt) as JwtPayload & { id: string };

    const refreshtokenHash = crypto.createHash("sha256").update(refreshtoken).digest("hex");

    const session = await sessionModel.findOne({
      refreshtokenHash,
      revoked: false
    });

    if(!session){
      return res.status(401).json({
        success: false,
        message: "Invalid Refresh Token"
      });
    }
    
    const accesstoken = jwt.sign(

      { id: decoded.id },
      config.Jwt,
      { expiresIn: "15m" }
    );

    const newrefreshtoken = jwt.sign(

      { id: decoded.id },
      config.Jwt,
      { expiresIn: "7d" }

    );

    const newRefreshtokenHash = crypto.createHash("sha256").update(newrefreshtoken).digest("hex");

    session.refreshtokenHash = newRefreshtokenHash;
    await session.save();

    res.cookie("refreshtoken",newrefreshtoken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge:7 * 24 * 60 * 60 * 1000
  })

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accesstoken

    });

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
      success: false
    });
  }
}

export async function logout(req: Request, res: Response) {

  const refreshtoken = req.cookies.refreshtoken;

  if (!refreshtoken) {
    return res.status(400).json({
      success: false,
      message: "Token not found" 
    });
  }

  
  const refreshTokenHash = crypto.createHash("sha256").update(refreshtoken).digest("hex");
  
  
  const session = await sessionModel.findOne({
    refreshtokenHash: refreshTokenHash, 
    revoked: false
  });

  if (!session) {
    return res.status(400).json({
      success: false,
      message: "Invalid Refresh Token" 
    });
  }

 
  session.revoked = true;
  await session.save(); !


  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
}

export async function logoutAll(req: Request, res: Response) {

  const refreshtoken = req.cookies.refreshtoken;

  if (!refreshtoken) {
    return res.status(400).json({
      success: false,
      message: "Token not found" 
    });
  }

  const decoded = jwt.verify(refreshtoken, config.Jwt) as JwtPayload & { id: string };

  await sessionModel.updateMany(
    { user: decoded.id, revoked: false },
    { revoked: true }
  );

  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  });

  res.status(200).json({
    success: true,
    message: "Logged out from all sessions successfully"
  });

}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false
      });
    }

    const otpHash = crypto.createHash("sha256").update(otp.toString()).digest("hex");
   
    const otpDoc = await otpModel.findOne({ 
      email, 
      otpHash 
    });

    if (!otpDoc) {
      return res.status(400).json({
        message: "Invalid or Expired OTP", 
        success: false
      });
    }

    const user = await User.findByIdAndUpdate(otpDoc.user, { verified: true }, { new: true });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    await otpModel.deleteMany({
      user: otpDoc.user
    }); 

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
      user: {
        username: user.username,
        email: user.email,
        verified: user.verified
      }
    });

  } catch (error) {
  console.error("Error in verifyEmail controller:", error);
  return res.status(500).json({
    message: "Internal server error",
    success: false
  });
  }
}