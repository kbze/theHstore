const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Helper to generate 6 digit code
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = generateOTP();

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationCode,
            isVerified: false
        });

        if (user) {
            // Send email
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'The 8 Store - Email Verification',
                    message: `Welcome to The 8 Store!\n\nYour 6-digit verification code is: ${verificationCode}\n\nPlease enter this code on the website to verify your account.`,
                });
            } catch (emailError) {
                console.error("Email failed to send:", emailError);
                // Keep the account but signal that email failed
            }

            // Return success but NO token (can't login yet)
            res.status(201).json({
                message: 'Registration successful. Please check your email for the verification code.',
                email: user.email
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Verify Email Code
router.post('/verify', async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Code matches, verify user
        user.isVerified = true;
        user.verificationCode = undefined; // clear the code
        await user.save();

        res.status(200).json({
            message: 'Email verified successfully!',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Verification Error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {

            // Check verification status BEFORE allowing login
            if (!user.isVerified) {
                // Optionally generate a new code and resend it
                const newCode = generateOTP();
                user.verificationCode = newCode;
                await user.save();

                try {
                    await sendEmail({
                        email: user.email,
                        subject: 'The 8 Store - New Verification Code',
                        message: `Your new 6-digit verification code is: ${newCode}\n\nPlease enter this code on the website to verify your account.`,
                    });
                } catch (emailError) {
                    console.error("Resend email failed:", emailError);
                }

                return res.status(403).json({
                    message: 'Please verify your email address to log in. A new code has been sent to your email.',
                    requiresVerification: true,
                    email: user.email
                });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

module.exports = router;
