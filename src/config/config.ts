import { configDotenv } from "dotenv";

configDotenv()



const requiredEnvVariables = [
  "MONGO_URI",
  "PORT",
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_USER"
];


requiredEnvVariables.forEach((variableName) => {
  if (!process.env[variableName]) {
    throw new Error(`CRITICAL ERROR: "${variableName}" is not defined in environment variables!`);
  }
});

const config = {
  port: process.env.PORT || 3000,
  Mongo: process.env.MONGO_URI  || "" ,
  Jwt : process.env.JWT_SECRET || "",
  Google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
    user: process.env.GOOGLE_USER || ""
  }
}



export default config;