import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

function getUserById(id) {
  return User.findById(id).select("_id name email");
}

// custom middleware
const isAuthorized = async (req, res, next) => {
  let token;
  if (req.headers["x-auth-token"]) { // Corrected this line
    try {
      token = req.headers["x-auth-token"]; // Corrected this line
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await getUserById(decoded.payload); // Assuming 'payload' contains user ID
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" }); // Corrected this line
    }
  } else {
    res.status(401).json({ error: "Unauthorized" }); // Added else condition to handle missing token
  }
};

export { isAuthorized };
