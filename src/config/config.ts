import { configDotenv } from "dotenv";

configDotenv()

const config = {
  port: process.env.PORT || 3000,
  Mongo: process.env.MONGO_URI  || "" 
}

export default config;