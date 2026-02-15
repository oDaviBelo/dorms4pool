import jwt from "jsonwebtoken";
type tokenProps = {
  email: string;
  id: number;
  name?: string;
};
export const generateToken = (data: tokenProps) => {
  let key = process.env.JWT_SECRET_KEY as string;
  const token = jwt.sign({ data }, key);
  return token;
};

export const verifyToken = (token: string) => {
  let key = process.env.JWT_SECRET_KEY as string;

  try {
    return jwt.verify(token, key) as { data: { email: string; id: number } };
  } catch (error) {
    return false;
  }
};
