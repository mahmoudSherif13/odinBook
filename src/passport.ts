import passport from "passport";
import passportJWT from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/user";
import dotenv from "dotenv";
import * as bcrypt from "bcryptjs";

dotenv.config();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload._id);
        console.log("from jwt");
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
