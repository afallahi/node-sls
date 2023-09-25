import bcrypt from "bcrypt";

export const getSalt = async () => {
    return await bcrypt.genSalt();
};

export const getHashedPassword = async (
    password: string, 
    salt: string
) => {
    return await bcrypt.hash(password, salt);
}

export const validatePassword = async (
    password: string,
    savedPassword: string,
    salt: string
) => {
    return (await getHashedPassword(password, salt)) === savedPassword;
}