import express from "express";
import * as path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./router";
import "./passport";
dotenv.config();
const app = express();

if (process.env.NODE_ENV !== "testing") {
  require("./dbConfigs/production");
}

app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/", router);

export default app;
