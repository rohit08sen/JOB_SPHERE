import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URL, {
      dbName:"JOB_PORTAL_WITH_AUTOMATION"
    })
    console.log(`MongoDb Connected!!! DB HOST:${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("MonogoDb connection Error", error);
    process.exit(1);
  }
}

export default connectDB