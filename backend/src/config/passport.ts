import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/userModel.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

import { env } from "../config/myEnv.js";

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Google OAuth credentials are not defined in environment variables"
  );
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const options = {
  // This tells passport to extract the token from the
  // 'Authorization: Bearer <token>' header
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(
    options,
    async (
      jwt_payload: { id: string },
      done: (error: Error | null, user: IUser | false | null) => void
    ) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.BASE_URL}/api/auth/google/callback`,
    },
    // @ts-expect-error we are not utilizing access and refresh token but could come in handy later
    async (accessToken, refreshToken, profile, done) => {
      try {
        await User.findOrCreate(profile);
        const user = await User.findByGoogleId(profile.id);
        if (user) {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: unknown, done) => {
  const userObj = user as IUser;
  done(null, userObj.id || userObj._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
