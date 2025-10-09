import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://Sachin947:Sachin123@cluster947.n1o4otf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster947"
    );
  } catch (error) {
    console.log("Some error occured ", error);
  }
};
export { connectDB };
