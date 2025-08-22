import bcrypt from "bcrypt";

export const hashPassword = async (
    originPass: string
) => {
    const salt = await bcrypt.genSalt(15);
    return await bcrypt.hash(originPass, salt);
}
