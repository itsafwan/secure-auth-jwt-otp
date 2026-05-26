import { configDotenv } from "dotenv";

configDotenv()



const requiredEnvVariables = [
  "MONGO_URI",
  "PORT",
];


requiredEnvVariables.forEach((variableName) => {
  if (!process.env[variableName]) {
    throw new Error(`CRITICAL ERROR: "${variableName}" is not defined in environment variables!`);
  }
});

const config = {
  port: process.env.PORT || 3000,
  Mongo: process.env.MONGO_URI  || "" ,
}



export default config;