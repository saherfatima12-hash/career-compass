const express = require("express");

const router = express.Router();


const {
    registerUser,
    loginUser,
    verifyEmail,
    checkUser,
    checkVerification,
    confirmVerification,
    cancelVerification,
    forgotPassword,
    resetPassword
} = require("../controllers/userController");




// Signup route
router.post(
    "/register",
    registerUser
);




// Login route
router.post(
    "/login",
    loginUser
);




// Email verification route
router.get(
    "/verify/:token",
    verifyEmail
);




// Confirm verification (Yes button)
router.get(
    "/confirm/:token",
    confirmVerification
);

router.get(
    "/cancel/:token",
    cancelVerification
);

router.get(
"/check-user/:email",
checkUser
);
// Check verification status
router.get(
    "/check-verification/:email",
    checkVerification
);
// Forgot password route
router.post(
    "/forgot-password",
    forgotPassword
);
router.post(
    "/reset-password/:token",
    resetPassword
);

module.exports = router;