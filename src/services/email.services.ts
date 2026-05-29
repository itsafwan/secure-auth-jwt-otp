import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user:config.Google.user,
    clientId: config.Google.clientId,
    clientSecret: config.Google.clientSecret,
    refreshToken: config.Google.refreshToken,
  }
})


transporter.verify((error, success) => {
  if (error) {
    console.error("Email server connecting error:", error);
  } else {
    console.log("Email server is ready to send messages!");
  }
});

export default transporter;