import { Request, RequestHandler } from "express";
import User from "../../model/userSchema";
import { responseSending } from "../../utils/responseSending";
import { hashPassword } from "../../utils/hashPassword";
import crypto from "crypto";
import { generateJWT } from "../../utils/generateJWT";
import { comparePassword } from "../../utils/comparePassword";
import { changePasswordEmail } from "../../mailer/changePassword";

interface IRegisterRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export const register: RequestHandler = async (req: IRegisterRequest, res) => {
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

export const login: RequestHandler = async (req: IRegisterRequest, res) => {
    try {
        const { email, password } = req.body;
        const userEmail = await User.findOne({ email });

        if (!userEmail) {
            return responseSending(res, 404, false, "User not found");
        }

        const matchPassword = await comparePassword(password, userEmail.password);

        if (!matchPassword) {
            return responseSending(res, 401, false, "Invalid password");
        }

        const jwtToken = await generateJWT(userEmail);
        responseSending(res, 200, true, "Login successful", { token: jwtToken });

    } catch (error) {
        console.error("Error logging in user:", error);
        responseSending(res, 500, false, "Internal server error");
    }
}

export const sendEmailForChangePassword: RequestHandler = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return responseSending(res, 400, false, "Email not found");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return responseSending(res, 404, false, "User not found");
        }

        await changePasswordEmail(user);
        responseSending(res, 200, true, "Email sent successfully");

    } catch (error: any) {
        console.error("Error sending email for change password:", error);
        return responseSending(res, 500, false, "Internal server error");
    }
}

export const changePassword: RequestHandler = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!token) {
            return responseSending(res, 400, false, "Token not found");
        }

        const user = await User.findOne({ token });
        if (!user) {
            return responseSending(res, 404, false, "User not found");
        }

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        user.token = crypto.randomBytes(32).toString("hex");
        await user.save();
        return responseSending(res, 200, true, "Password changed successfully");
    } catch (error: any) {
        console.error("Error changing password:", error);
        return responseSending(res, 500, false, "Internal server error");
    }
}