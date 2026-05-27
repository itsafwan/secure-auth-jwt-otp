import {type Request, type Response} from "express";
import User from "../models/user.model.js";
import crypto from "crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";


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

  const accesstoken = jwt.sign(
  { id: user._id }, 
  config.Jwt,
    {
      expiresIn:"15m"
    }
);

const refreshtoken = jwt.sign(
  { id: user._id }, 
  config.Jwt,
    {
      expiresIn:"7d"
    }
);

  res.cookie("refreshtoken",refreshtoken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge:7 * 24 * 60 * 60 * 1000 
  })

res.status(201).json({
    message: "User registered successfully",
    success: true,
    accesstoken,
    user:{
      username:user.username,
      email:user.email
    }
  });

}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    
    const user = await User.findById(req.userId); 

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
    return res.status(500).json({ message: "Server error" });
  }
}
 
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false
      });
    }

   
    const incomingHash = crypto.createHash("sha256").update(password).digest("hex");
    
    if (incomingHash !== user.password) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false
      });
    }

    const token = jwt.sign(
      { id: user._id }, 
      config.Jwt,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token, 
      user: {
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error during login",
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