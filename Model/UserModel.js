const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    pic:{type:String, default:
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-symbol-website-2282658551"
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  }, 
  {timestamps: true}
);

const User = mongoose.model("User", userSchema);
module.exports = User;