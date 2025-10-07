import jwt from "jsonwebtoken";
const userAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized : No Token provided" });
  }
  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      res.json(error);
      console.log(error);
    }
  } else return { success: false, message: "User not authorized" };
};
export default userAuth;
