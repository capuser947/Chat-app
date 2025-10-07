import express from "express";
import {
  handleRegisterUser,
  handleGetAllUsers,
  handleLogin,
  handleGetSingleUser,
} from "./userController";
import userAuth from "../../middlewares/authMiddleware";
const userRouter = express.Router();
userRouter.get("/", userAuth, handleGetAllUsers);
userRouter.get("/getSingleUser/:id", handleGetSingleUser);
userRouter.post("/register", handleRegisterUser);
userRouter.post("/login", handleLogin);
export default userRouter;
