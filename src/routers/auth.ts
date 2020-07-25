import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info.message,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      jwt.sign(JSON.stringify(user), process.env.JWT, (err, token) => {
        if (err) {
          return res.status(404).json(err);
        }
        return res.json({ user, token });
      });
    });
  })(req, res);
});

export default router;
