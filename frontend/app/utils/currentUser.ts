import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
const getCurrentUser = () => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      console.log("No token found");
      return;
    } else {
      const decoded = jwt.decode(token) as {
        _id: string;
        name: string;
        email: string;
      };
      console.log(
        "decodeddecodeddecodeddecodeddecodeddecodeddecodeddecoded",
        decoded
      );
      return decoded;
    }
  } catch (error) {
    return;
  }
};
export default getCurrentUser;
