import User from "./userModel";
import {
  registerUser,
  getAllUsers,
  userLogin,
  getSingleUser,
} from "../User/userService";
const handleGetAllUsers = async (req: any, res: any) => {
  try {
    const result = await getAllUsers();
    return res.status(200).send({
      data: result,
      success: true,
      message: "Data retreived successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Some error occured",
    });
  }
};
const handleRegisterUser = async (req: any, res: any) => {
  try {
    console.log("It reached the collection");
    const user = req.body;
    const result = await registerUser(user);
    return res.status(200).send({
      data: result,
      success: true,
    });
  } catch (error: any) {
    return res.status(409).send({
      success: false,
      message: error.message,
    });
  }
};

const handleLogin = async (req: any, res: any) => {
  try {
    const userCredentials = req.body;
    const token = await userLogin(userCredentials);
    return res.status(200).send({
      success: true,
      token: token,
    });
  } catch (error: any) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
};
const handleGetSingleUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = await getSingleUser(id);
    return res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
};
export {
  handleRegisterUser,
  handleGetAllUsers,
  handleLogin,
  handleGetSingleUser,
};
