import { IUser } from "../model/userSchema";
import ejs from "ejs";
import path from "path";
import { transporter } from "../config/transporterEmail";

export const changePasswordEmail = async (user: IUser) => {
    try {
        const emailHTML = await ejs.renderFile(
            path.join(__dirname, "../views/changePasswordEmail.ejs"),
            { token: user.token }
        );

        const mailOptions = {
            from: process.env.EMAIL as string,
            to: user.email,
            subject: "Change Password",
            html: emailHTML,
        }

        await transporter.sendMail(mailOptions);
        console.log("Change password email sent successfully");
    } catch (error: any) {
        console.error(`Error in sending change password email: ${error.message}`);
    }
}