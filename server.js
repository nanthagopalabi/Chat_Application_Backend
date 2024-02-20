import  express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dataBaseConnection } from "./Config/db.js";
import {userRouter} from '../Router/userRouter.js';
import { isAuthorized } from "../middleware/authenticate.js";
import { ChatRouter } from "./router/chatRouter.js";
import { MsgRouter } from "./router/messageRouter.js";

//configure env variables
dotenv.config();

//server setup
const app = express();
const PORT = process.env.PORT;

//database connection
dataBaseConnection();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api", userRouter);
app.use("/chat",isAuthorized, ChatRouter);
app.use("/message", isAuthorized, MsgRouter)

//listen the server
app.listen(PORT, ()=>{
    console.log(`Server started in localhost:${PORT}`);
})