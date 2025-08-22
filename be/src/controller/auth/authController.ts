import { Request, RequestHandler } from "express";
import User from "../../model/userSchema";
import { responseSending } from "../../utils/responseSending";
import { hashPassword } from "../../utils/hashPassword";
import crypto from "crypto";

interface IRegisterRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export const register : RequestHandler = async(req: IRegisterRequest, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return responseSending(res, 400, false, "Email and password are required");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // User already exists
            return responseSending(res, 400, false, "User already exists");
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            token: crypto.randomBytes(32).toString("hex")
        });

        //send successful response
        responseSending(res, 201, true, "User registered successfully");

    } catch (error) {
        console.error("Error registering user:", error);
        responseSending(res, 500, false, "Internal server error");
    }
}

