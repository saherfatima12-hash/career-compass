console.log("📧 NODEMAILER sendEmail.js LOADED");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
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
      "Click the link below to create a new password for your Career Compass account.";
    buttonText = "Reset Password";
  } else {
    link = `https://career-compass-eo2e.vercel.app/api/users/verify/${token}`;

    subject = "Verify your Career Compass email";
    title = "Welcome to Career Compass";
    message =
      "Please verify your email address to activate your account.";
    buttonText = "Verify Email";
  }

  const expiryLine =
    type === "reset"
      ? "This link will expire in 15 minutes."
      : "This verification link will expire in 24 hours.";

  // Plain-text version — spam filters weigh emails with no text
  // alternative more heavily as "promotional/bulk"
  const text = `Career Compass

${title}

${message}

${buttonText}: ${link}

${expiryLine}

If you did not request this, you can safely ignore this email.
`;

  // Toned-down HTML — removed heavy gradients/large button styling
  // that read as "marketing email" to spam filters, kept it simple
  // and text-forward instead.
  const html = `
      <div style="
        font-family: Arial, Helvetica, sans-serif;
        background: #ffffff;
        padding: 24px;
        color: #1f2937;
        max-width: 480px;
        margin: 0 auto;
        line-height: 1.5;
      ">

        <p style="font-size: 15px; margin: 0 0 4px;">
          <strong>Career Compass</strong>
        </p>

        <h2 style="font-size: 18px; margin: 16px 0 8px; color: #132958;">
          ${title}
        </h2>

        <p style="font-size: 14px; color: #374151; margin: 0 0 16px;">
          ${message}
        </p>

        <p style="margin: 0 0 16px;">
          <a href="${link}"
            style="
              color: #132958;
              font-size: 14px;
              text-decoration: underline;
            ">
            ${buttonText}
          </a>
        </p>

        <p style="font-size: 12px; color: #6b7280; margin: 24px 0 0;">
          ${expiryLine}
        </p>

        <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0;">
          If you did not request this, you can safely ignore this email.
        </p>

      </div>
    `;

  try {
    await transporter.sendMail({
      from: `"Career Compass" <${process.env.EMAIL_USER}>`,
      to: email,
      replyTo: process.env.EMAIL_USER,
      subject: subject,
      text: text,
      html: html,
    });

    // console.log("MAIL SENT to", email);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;