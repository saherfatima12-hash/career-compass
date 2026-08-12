const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },


    email:{
        type:String,
        required:true,
        unique:true
    },


    password:{
        type:String,
        required:true
    },


    isVerified:{
        type:Boolean,
        default:false
    },


    verificationToken:{
        type:String
    },


    verificationTokenExpire:{
        type:Date
    },

    resetPasswordToken: {
    type:String,
    default:null
},

resetPasswordExpire: {
    type:Date,
    default:null
},
},{
    timestamps:true
});


module.exports = mongoose.model("User", userSchema);