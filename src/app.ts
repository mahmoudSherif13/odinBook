import express from "express";
import * as path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./router";
import "./dbConfig";
require("./passport");

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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", router);

export default app;
