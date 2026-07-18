const express = require("express");

const router = express.Router();


const {
    registerUser,
    loginUser,
    verifyEmail,
    checkUser,
    checkVerification,
    confirmVerification,
    cancelVerification
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



module.exports = router;