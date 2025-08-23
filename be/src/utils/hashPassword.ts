import bcrypt from "bcrypt";

export const hashPassword = async (
    plainPassword: string
) => {
    const salt = await bcrypt.genSalt(15);
    return await bcrypt.hash(plainPassword, salt);
}