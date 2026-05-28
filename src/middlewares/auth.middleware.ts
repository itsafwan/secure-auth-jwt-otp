// import { type Request, type Response, type NextFunction } from "express";
// import jwt, { type JwtPayload } from "jsonwebtoken";
// import config from "../config/config.js";


// export interface AuthenticatedRequest extends Request {
//   userId?: string;
// }

// export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
//   const token = req.headers.authorization?.split(" ")[1];
  
//   if (!token) {
//     return res.status(401).json({ message: "No token provided, access denied", success: false });
//   }

//   try {
//     const decoded = jwt.verify(token, config.Jwt) as JwtPayload & { id: string };
    
    
//     req.userId = decoded.id; 
    
//     next(); 
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token", success: false });
//   }
// }