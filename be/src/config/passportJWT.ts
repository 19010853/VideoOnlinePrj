import passport from "passport"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import User from "../model/userSchema";
import dotenv from 'dotenv';

dotenv.config();
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY as string,
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error, false);
    }
}));

export default passport;