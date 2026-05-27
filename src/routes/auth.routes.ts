import { Router } from "express";
import * as authController from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register',authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/getProfile', verifyToken,authController.getMe);
authRouter.get('/refresh-token', authController.refreshtoken);


export default authRouter;