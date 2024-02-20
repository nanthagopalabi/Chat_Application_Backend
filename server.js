import  express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dataBaseConnection } from "./Config/db.js";
import { userRouter } from "./router/UserRouter.js";
import { isAuthorized } from "./Middleware/authenticate.js";
import {chatRouter} from "./router/chatRouter.js";
import { msgRouter } from "./router/messageRouter.js";

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
app.use("/chat",isAuthorized, chatRouter);
app.use("/message", isAuthorized, msgRouter)

//listen the server
app.listen(PORT, ()=>{
    console.log(`Server started in localhost:${PORT}`);
})