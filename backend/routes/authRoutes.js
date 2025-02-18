const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const passport = require("passport");
require("dotenv").config();

// Nodemailer setup for email verification
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register route
router.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, phone, address, gender, username, password } = req.body;
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        user = new User({
            firstname,
            lastname,
            email,
            phone,
            address,
            gender,
            username,
            password: hashedPassword,
            verificationToken
        });

        await user.save();

        // Send verification email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "PawSphere Email Verification",
            html: `<h3>Click the link below to verify your email:</h3>
                   <a href="${process.env.BASE_URL}/auth/verify/${verificationToken}">Verify Email</a>`
        };

        transporter.sendMail(mailOptions);

        res.json({ message: "Registration successful! Check your email to verify your account." });

    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
});

// Email Verification Route
router.get("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findOne({ email: decoded.email });

        if (!user) return res.status(400).json({ message: "Invalid token!" });

        user.verified = true;
        user.verificationToken = null;
        await user.save();

        res.send(`<h1>Email verified! <a href="/">Login Now</a></h1>`);

    } catch (error) {
        res.status(500).json({ message: "Invalid or expired token!" });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found!" });
        if (!user.verified) return res.status(400).json({ message: "Please verify your email first!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password!" });

        res.json({ message: "Login successful!", user });

    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
});

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login.html" }),
    (req, res) => {
        res.redirect("/index.html");
    }
);

module.exports = router;
