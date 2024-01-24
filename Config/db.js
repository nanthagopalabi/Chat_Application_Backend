import mongoose from "mongoose";

export function dataBaseConnection(){
    const params = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    };
    try{
        mongoose.set("strictQuery", true);
        mongoose.connect(process.env.MONGO_URL, params);
        console.log("MOngoDB connected");
    }catch(error){
        console.log("Mongo Db Connection failed", error);
    }
}