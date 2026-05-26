import {type Request, type Response} from "express";
import User from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
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
 
