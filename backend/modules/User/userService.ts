import User from "../User/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const registerUser = async (user: any) => {
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    throw new Error("User Already Exists");
  }
  const encryptedPassword = await bcrypt.hash(user.password, 10);
  user.password = encryptedPassword;
  const result = await User.insertOne(user);
  return result;
};
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
};
const userLogin = async (userCredentials: any) => {
  try {
    const user = await User.findOne({ email: userCredentials.email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        userCredentials.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Password is Invalid");
      }
      const jwtSecret = process.env.JWT_SECRET;
      console.log("I am in jwt", jwtSecret);
      if (!jwtSecret) {
        throw new Error("JWT secret is undefined");
      }
      // create token
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        jwtSecret
      );
      return token;
    } else {
      throw new Error("User Not found");
    }
  } catch (error: any) {
    console.log("I am in error");
    throw new Error(error);
  }
};
const getSingleUser = async (id: string) => {
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new Error("User Not Found");
    }
    return { _id: user._id, name: user.name, email: user.email };
  } catch (error: any) {
    throw new Error(error);
  }
};

export { registerUser, getAllUsers, userLogin, getSingleUser };
