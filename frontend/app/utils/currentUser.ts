import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
const getCurrentUser = () => {
  try {
    const token = Cookies.get("token");
    console.log("token", token);
    const jwtKey = process.env.NEXT_PUBLIC_JWT_SECRET;
    console.log(jwtKey);
    if (!token) {
      console.log("No token found");
    } else {
      const decoded = jwt.decode(token);
      return decoded;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
export default getCurrentUser;
