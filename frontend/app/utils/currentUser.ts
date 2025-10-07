import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
const getCurrentUser = async () => {
  try {
    const token = Cookies.get("token");
    console.log("token", token);
    const jwtKey = process.env.NEXT_PUBLIC_JWT_SECRET;
    console.log(jwtKey);
    if (!token || !jwtKey) {
      throw new Error("GMARAO");
    }
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error: any) {
    throw new Error(error);
  }
};
export default getCurrentUser;
