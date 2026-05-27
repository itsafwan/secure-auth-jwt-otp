import express, {type Application} from "express"
import cors from "cors";
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js";


const app : Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use('/api/v1/auth',authRouter)

export default app;