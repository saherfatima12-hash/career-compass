const nodemailer = require("nodemailer");


const sendEmail = async (email, token) => {


    const transporter = nodemailer.createTransport({

        service:"gmail",

        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }

    });




    const verificationLink =
    `http://localhost:5000/api/users/verify/${token}`;





    const mailOptions = {


      from: `Career Compass <${process.env.EMAIL_USER}>`,


        to: email,


        subject:"Career Compass - Email Verification",



        html:`

        <div style="
            font-family: Arial, sans-serif;
            background:#f5f7fb;
            padding:30px;
        ">


            <div style="
                max-width:500px;
                margin:auto;
                background:white;
                padding:30px;
                border-radius:15px;
                text-align:center;
                box-shadow:0 5px 20px rgba(0,0,0,0.1);
            ">


                <h1 style="
                    color:#132958;
                ">
                    Career Compass
                </h1>



                <h2>
                    Welcome to Career Compass 🎓
                </h2>



                <p style="
                    color:#555;
                    font-size:16px;
                ">
                    Thank you for creating your account.
                </p>



                <p style="
                    color:#555;
                    font-size:16px;
                ">
                    Please verify your email address to activate your account.
                </p>





                <a href="${verificationLink}"

                style="
                    display:inline-block;
                    margin-top:20px;
                    padding:14px 30px;
                    background:#132958;
                    color:white;
                    text-decoration:none;
                    border-radius:30px;
                    font-size:16px;
                ">

                    Verify Email

                </a>
                  <p style="
    margin-top:20px;
    color:#555;
    font-size:14px;
">
This verification link will expire in 24 hours.
</p>




                <p style="
                    margin-top:30px;
                    color:#888;
                    font-size:13px;
                ">

                    If you did not create this account,
                    you can ignore this email.

                </p>



            </div>


        </div>


        `


    };





    const info = await transporter.sendMail(mailOptions);


    console.log("MAIL SENT:", info.messageId);


};




module.exports = sendEmail;