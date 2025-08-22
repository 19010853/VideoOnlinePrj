import { Request, RequestHandler } from "express";
import User from "../../model/userSchema";
import { responseSending } from "../../utils/responseSending";

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

        const newUser = await User.create({
            email,
            password,
        });

        //send successful response

    } catch (error) {
        console.error("Error registering user:", error);
        responseSending(res, 500, false, "Internal server error");
    }
}

