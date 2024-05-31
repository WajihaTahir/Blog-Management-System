import jwt from "jsonwebtoken";

const generateToken = (userId: string) => {
  const payload = {
    sub: userId,
  };

  const secretOrPrivateKey = process.env.TOK_PASSWORD;

  const signOptions = {
    expiresIn: "20d",
  };

  const jsonwebtoken = secretOrPrivateKey
    ? jwt.sign(payload, secretOrPrivateKey, signOptions)
    : undefined;
  return jsonwebtoken;
};

export { generateToken };
