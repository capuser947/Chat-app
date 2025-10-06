import express from "express";
import { handleAddUser, handleGetAllUsers } from "./userController";
const userRouter = express.Router();
userRouter.post("/", handleGetAllUsers);
userRouter.post("/adduser", handleAddUser);
export default userRouter;
