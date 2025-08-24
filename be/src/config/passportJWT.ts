import passport from "passport"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import User, { IUser } from "../model/userSchema";
import dotenv from 'dotenv';
import { Types } from "mongoose";
import { Request, RequestHandler } from "express";

dotenv.config();

export interface AuthenticatedRequest extends Request {
    user: IUser;
}

export type AuthenticatedRequestHandler = RequestHandler<any, any, any, any, AuthenticatedRequest>;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string,
}, async (payload, done) => {
    try {
        console.log('JWT Payload:', payload); // Debug log
        // Use payload._id instead of payload.id
        const user = await User.findById(payload._id);
        if (user) {
            console.log('User found:', user._id); // Debug log
            done(null, user);
        } else {
            console.log('User not found for payload._id:', payload._id); // Debug log
            done(null, false);
        }
    } catch (error) {
        console.error('JWT Strategy error:', error); // Debug log
        done(error, false);
    }
}));

export default passport;