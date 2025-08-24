import { AuthenticatedRequestHandler } from "../../config/passportJWT";
import { responseSending } from "../../utils/responseSending";

export const getUserDetails: AuthenticatedRequestHandler = async (req, res) => {
    try {
        console.log('getUserDetails called, req.user:', req.user); // Debug log

        // Check if user exists in request (set by passport middleware)
        if (!req.user || !(req.user as any)._id) {
            console.log('No user found in request'); // Debug log
            return responseSending(res, 401, false, "User not authenticated");
        }

        const userId = (req.user as any)._id;
        console.log('Looking for user with ID:', userId); // Debug log

        // Since req.user is already the full user object from passport, we can use it directly
        const user = req.user;

        console.log('User found:', (user as any).email); // Debug log
        responseSending(res, 200, true, "User details found", { user });
    } catch (error: any) {
        console.error("Error in getUserDetails", error);
        responseSending(res, 500, false, "Internal server error");
    }
}