import express from "express";
import * as path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
// import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import * as userController from "./controllers/user";
require("./dbconfig");

const app = express();

app.set("port", process.env.PORT || 3000);
// app.use(compression());
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

app.get("/users", userController.list);
app.get("/users/new", userController.create);

export default app;
