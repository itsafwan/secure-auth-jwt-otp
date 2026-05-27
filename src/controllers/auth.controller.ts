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

  const token = jwt.sign(
  { id: user._id }, 
  config.Jwt,
    {
      expiresIn:"1d"
    }
);

res.status(201).json({
    message: "User registered successfully",
    success: true,
    token,
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
