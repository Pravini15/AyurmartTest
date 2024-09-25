import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import CartRoute from "./routes/CartRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PARAMS = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};
const URI = process.env.MONGOOSE_URI;
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/checkout", CartRoute);

mongoose.set("strictQuery", false);
mongoose.connect(URI, PARAMS)
    .then(() => app.listen(PORT, 
        () => console.info(`Cart Service running on PORT ${PORT} 🔥`)))
    .catch((err) => console.error(err.message));
