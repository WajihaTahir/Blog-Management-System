import bcrypt from "bcrypt";

export const verifyPassword = async (
  plainTextPassword: string,
  hash: string
) => {
  try {
    const isPasswordCorrect = await bcrypt.compare(plainTextPassword, hash);
    if (isPasswordCorrect) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error verifyng password");
    return false;
  }
};
