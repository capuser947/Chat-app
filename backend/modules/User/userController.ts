import User from "./userModel";

const handleGetAllUsers = async (req: any, res: any) => {
  try {
    const users = await User.find();
    return res.send({
      code: 200,
      data: users,
      success: true,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error,
    });
  }
};
const handleAddUser = async (req: any, res: any) => {
  try {
    console.log("It reached the collection");
    const { name, email, password } = req.body;
    const user = req.body;
    console.log(req.body);
    const result = await User.insertOne(user);
    return res.send({
      code: 200,
      data: result,
      success: true,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error,
    });
  }
};
export { handleAddUser, handleGetAllUsers };
