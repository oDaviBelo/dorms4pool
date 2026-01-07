import jwt from "jsonwebtoken";
export const generateToken = (email: string) => {
  let key = process.env.JWT_SECRET_KEY as string;
  const token = jwt.sign({ email }, key);
  return token;
};

export const verifyToken = (token: string) => {
  let key = process.env.JWT_SECRET_KEY as string;

  try {
    return jwt.verify(token, key) as { email: string };
  } catch (error) {
    return null;
  }
};
