import { Router } from "express";
import * as authController from "../controllers/auth.controller.js"

const authRouter = Router();

authRouter.post('/register',authController.register);
authRouter.post('/login',authController.login);
authRouter.get('/getProfile', authController.getMe);
authRouter.get('/refresh-token', authController.refreshtoken);
authRouter.get('/logout', authController.logout);
authRouter.get('/logout-all', authController.logoutAll);
authRouter.get('/active-devices', authController.getActiveSessions);
authRouter.post('/verify-email', authController.verifyEmail);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post('/change-password', authController.changepassword);
 

export default authRouter;