import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
const getCurrentUser = () => {
  const token = Cookies.get("token");

  if (!token) {
    console.log("No token found");
    return;
  } else {
    const decoded = jwt.decode(token);
    return decoded;
  }
};
export default getCurrentUser;
