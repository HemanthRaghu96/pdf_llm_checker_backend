import express from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import userRoute from "./checkResults/checkResults.route";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRoute);

export default app;
