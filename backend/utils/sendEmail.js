console.log("📧 NODEMAILER sendEmail.js LOADED");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
   user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, token, type = "verify") => {
  let link;
  let subject;
  let title;
  let message;
  let buttonText;

  if (type === "reset") {
    link = `https://career-compass-am23-sepia.vercel.app/reset-password/${token}`;

    subject = "Reset your Career Compass password";
    title = "Reset Your Password";
    message =
      "Click the button below to create a new password for your Career Compass account.";
    buttonText = "Reset Password";
  } else {
    link = `https://career-compass-eo2e.vercel.app/api/users/verify/${token}`;

    subject = "Verify your Career Compass email";
    title = "Welcome to Career Compass";
    message =
      "Please verify your email address to activate your account.";
    buttonText = "Verify Email";
  }

  const html = `
      <div style="
        font-family: Arial, sans-serif;
        background: #f5f7fb;
        padding: 30px;
      ">

        <div style="
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
        ">

          <h1 style="color:#132958;">
            Career Compass
          </h1>

          <h2>
            ${title}
          </h2>

          <p style="color:#555;font-size:16px;">
            ${message}
          </p>

          <a href="${link}"
            style="
              display:inline-block;
              margin-top:20px;
              padding:14px 30px;
              background:#132958;
              color:white;
              text-decoration:none;
              border-radius:30px;
            ">
            ${buttonText}
          </a>

          <p style="
            margin-top:25px;
            color:#888;
            font-size:13px;
          ">
            ${
              type === "reset"
                ? "This link will expire in 15 minutes."
                : "This verification link will expire in 24 hours."
            }
          </p>

        </div>
      </div>
    `;

  try {
    await transporter.sendMail({
      from: `"Career Compass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html,
    });

    // console.log("MAIL SENT to", email);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;