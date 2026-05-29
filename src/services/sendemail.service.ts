import nodemailer from "nodemailer";
import config from "../config/config.js";
import transporter from "./email.services.js";


interface ISendEmailOptions {
  to: string;
  subject: string;
  text?: string;  
  html?: string;  
}


export const sendEmail = async ({ to, subject, text, html }: ISendEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${config.Google.user}>`, 
      to,    
      subject, 
      text,    
      html,    
    });
    console.log("Message sent successfully!  %s", info.messageId);
    return info; 

  } catch (error) {
    console.error("Error while sending mail:", error);
    throw error; 
  }
};