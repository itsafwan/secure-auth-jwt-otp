import {type Request, type Response} from "express";
import User from "../models/user.model.js";
import crypto from "crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";


export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await User.findOne({ 

    $or:[
      {username},
      {email}
    ]
   });

   if(isAlreadyRegistered){
    res.status(400).json({
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

export async function getProfile(req: Request, res: Response) {
  try {
    
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false
      });
    }

    const decoded = jwt.verify(token, config.Jwt) as JwtPayload & { id: string };
    
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found in database",
        success: false
      });
    }

    
    return res.status(200).json({
      message: "User fetched successfully",
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
 
