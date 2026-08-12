const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
// Signup

const registerUser = async(req,res)=>{

    try{


        const {name,email,password} = req.body;




        const existingUser = await User.findOne({email});


        if(existingUser){

            return res.status(400).json({

                message:"This email is already registered"

            });

        }
       await PendingUser.findOneAndDelete({ email });
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );
        const verificationToken =
        crypto.randomBytes(32).toString("hex");
        const pendingUser = new PendingUser({


            name,

            email,

            password:hashedPassword,

            verificationToken,

            verificationTokenExpire:
            Date.now() + 24 * 60 * 60 * 1000


        });
        try{


            console.log("EMAIL RECEIVER:",email);


            await sendEmail(

                email,

                verificationToken

            );


        }

        catch(error){


            console.log(error);


            return res.status(400).json({

                message:
                "Email does not exist or could not be sent"

            });


        }
        await pendingUser.save();
        res.status(201).json({

            message:
            "Verification link sent. Please check your email."

        });

    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:error.message

        });


    }


};

// Verify Email


// Verify Email Confirmation Page

const verifyEmail = async(req,res)=>{

    try{

        const {token}=req.params;


        const pendingUser = await PendingUser.findOne({

            verificationToken: token,

            verificationTokenExpire:{
                $gt: Date.now()
            }

        });



        if(!pendingUser){

            return res.send(
                "Invalid or expired verification link"
            );

        }
       res.send(`

<html>

<head>

<title>Career Compass</title>

<style>

body{

font-family:Arial;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
background:#f4f7ff;

}


.box{

background:white;
padding:30px;
border-radius:15px;
text-align:center;
box-shadow:0 0 20px #ccc;

}


button{

padding:12px 20px;
margin:10px;
border:none;
border-radius:8px;
cursor:pointer;

}


.yes{

background:#2563eb;
color:white;

}


.no{

background:#ddd;

}


#result{

margin-top:20px;
font-size:18px;

}


</style>
<script>

async function verifyAccount(){

    const response = await fetch(
        "/api/users/confirm/${token}"
    );

    const data = await response.text();

    document.getElementById("message").innerHTML = data;

}



async function cancelAccount(){

    const response = await fetch(
        "/api/users/cancel/${token}"
    );

    const data = await response.text();

    document.getElementById("message").innerHTML = data;

}


</script>

</head>


<body>


<div class="box">


<h2>
Career Compass
</h2>


<h3>
Is this you?
</h3>


<p>
You are trying to create an account on Career Compass.
</p>



<button class="yes" onclick="verifyAccount()">
Yes, Verify Account
</button>


<button class="no" onclick="cancelAccount()">
No, Cancel
</button>


<div id="message"></div>



<div id="result"></div>



</div>



<script>


async function verifyAccount(){


const response = await fetch(
"/api/users/confirm/${token}"
);


const data = await response.text();


document.getElementById("result").innerHTML=data;


}



async function cancelAccount(){


const response = await fetch(
"/api/users/cancel/${token}"
);


const data = await response.text();


document.getElementById("result").innerHTML=data;


}


</script>



</body>


</html>

`);



    }


    catch(error){

        console.log(error);

        res.status(500).send(
            "Verification failed"
        );

    }

};
// Confirm Verification

const confirmVerification = async(req,res)=>{

    try{

        const {token}=req.params;


        const pendingUser = await PendingUser.findOne({

            verificationToken:token,

            verificationTokenExpire:{
                $gt:Date.now()
            }

        });



        if(!pendingUser){

            return res.send(
                "Invalid or expired verification link"
            );

        }



        const newUser = new User({

            name:pendingUser.name,

            email:pendingUser.email,

            password:pendingUser.password,

            isVerified:true

        });



        await newUser.save();



        await PendingUser.deleteOne({

            _id:pendingUser._id

        });



        res.send(`

<h3>
🎉 Congratulations!
</h3>

<p>
Your Career Compass account has been created successfully.
</p>

<a href="http://localhost:5173">

Go to Career Compass Website

</a>

`);



    }

    catch(error){

        console.log(error);

        res.status(500).send(
            "Verification failed"
        );

    }

};
// Cancel Verification

const cancelVerification = async(req,res)=>{

    try{

        const {token}=req.params;


        await PendingUser.deleteOne({

            verificationToken:token

        });



        res.send(`

<h3>
❌ Verification Cancelled
</h3>

<p>
Your Career Compass account was not created.
</p>

`);


    }

    catch(error){

        console.log(error);

        res.status(500).send(
            "Cancellation failed"
        );

    }

};

// Check Verification Status

const checkVerification = async(req,res)=>{


    try{


        const {email} = req.params;



        const user = await User.findOne({

            email

        });
        if(user && user.isVerified){


            return res.json({

                verified:true,

                message:"Account verified"

            });


        }
        return res.json({

            verified:false

        });
    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:error.message

        });


    }


};
// Check User Exists

const checkUser = async(req,res)=>{

    try{

        const {email}=req.params;


        const user = await User.findOne({
            email
        });


        if(user){

            return res.json({
                exists:true
            });

        }


        return res.json({
            exists:false
        });


    }

    catch(error){

        console.log(error);

        res.status(500).json({
            message:error.message
        });

    }

};
// Login


const loginUser = async(req,res)=>{


    try{


        const {email,password}=req.body;





        const user = await User.findOne({email});







        if(!user){


            return res.status(400).json({

                message:"Email not found"

            });


        }








        const isPasswordCorrect =

        await bcrypt.compare(

            password,

            user.password

        );







        if(!isPasswordCorrect){


            return res.status(400).json({

                message:"Invalid password"

            });


        }








        res.status(200).json({


            message:"Login Successful",


            user:{


                name:user.name,

                email:user.email


            }


        });




    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:error.message

        });


    }
// Forgot Password

};
const forgotPassword = async(req,res)=>{


    try{


        const {email}=req.body;


        const user = await User.findOne({
            email
        });



        if(!user){

            return res.status(404).json({

                message:"Email not found"

            });

        }



        const resetToken =
        crypto.randomBytes(32).toString("hex");



        user.resetPasswordToken = resetToken;


        user.resetPasswordExpire =
        Date.now() + 15 * 60 * 1000;



        await user.save();



        const resetLink =
        `http://localhost:5173/reset-password/${resetToken}`;



        await sendEmail(

            email,

            resetToken,

            "reset"

        );



        res.json({

            message:"Password reset link sent to your email"

        });



    }


    catch(error){


        console.log(error);


        res.status(500).json({

            message:error.message

        });


    }


};
const resetPassword = async(req,res)=>{

    try{

        const {token} = req.params;

        const {password} = req.body;



        const user = await User.findOne({

            resetPasswordToken: token,

            resetPasswordExpire:{
                $gt: Date.now()
            }

        });



        if(!user){

            return res.status(400).json({

                message:"Invalid or expired reset link"

            });

        }



        const hashedPassword = await bcrypt.hash(
            password,
            10
        );



        user.password = hashedPassword;


        user.resetPasswordToken = null;

        user.resetPasswordExpire = null;



        await user.save();



        res.json({

            message:"Password reset successfully"

        });



    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:error.message

        });


    }

};
module.exports={

    registerUser,

    loginUser,

    verifyEmail,

    checkVerification,

    checkUser,

    confirmVerification,

    cancelVerification,

    forgotPassword,

     resetPassword

};