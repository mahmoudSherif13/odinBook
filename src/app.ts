import express, { Request, Response } from "express";
import * as path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
import dotenv from "dotenv";
require("./dbconfig");

import userRouter from "./routers/user";

dotenv.config();
const app = express();

app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json({ message: "HI" });
});

app.use("/users/", userRouter);

app.use((err, req: Request, res: Response) => {
  if (err) {
    res.status(500).json(err);
  }
});

export default app;
