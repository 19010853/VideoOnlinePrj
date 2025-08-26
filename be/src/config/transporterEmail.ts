import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL as string,
        pass: process.env.EMAIL_PASSWORD as string,
    },
});