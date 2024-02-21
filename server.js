import  express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { dataBaseConnection } from "./Config/db.js";
import { userRouter } from "./routes/userRouter.js";
import { isAuthorized } from "./middleware/authenticate.js";
import {chatRouter} from "./routes/chatRouter.js";
import { msgRouter } from "./routes/messageRouter.js";

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

// Object to track online users
const onlineUsers = {};

const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors:{
        origin:"*",

    },
    pingTimeout:60000
 });

 io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("setup",(user)=>{
        socket.join(user.data.id);
        onlineUsers[user.data.id] = socket.id; // Add user to online users
        socket.emit("connected");
        // Emit online users to the newly connected user
    socket.emit("onlineUsers", Object.keys(onlineUsers));
    console.log(Object.keys(onlineUsers))


    });

    

    socket.on("join chat",(room)=>{
        console.log(room)
        socket.join(room)

    });

    socket.on("new message",(newMessage)=>{
     const chat=newMessage._id;
     if(!chat){
        socket.emit("error", { message: "Chat ID is not defined in the new message" });
        return;
        
     }
    
     socket.broadcast.to(chat).emit("message received",newMessage)
        
    });
     // Handle typing event
     socket.on("typing", (data) => {
        const { chatId, isTyping } = data;
        socket.broadcast.to(chatId).emit("typing", { userId: socket.id, isTyping });
    });
    // Example: Listen for a "disconnect" event
    socket.on("disconnect", () => {
        console.log("User disconnected");
        // Remove user from online users
        const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
        if (userId) {
            delete onlineUsers[userId];
        }
    });
});

//listen the server
app.listen(PORT, ()=>{
    console.log(`Server started in localhost:${PORT}`);
})