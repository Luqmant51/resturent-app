    const db = require("../models");
    const bcrypt = require("bcrypt");
    const nodemailer = require("nodemailer");
    const jwt = require("jsonwebtoken");
    const env = process.env.NODE_ENV || 'development';
    const config = require('../config/config');

const JWT_SECRET = process.env.JWT_SECRET;

const getsignup = async (req, res) => {
    let isAdmin = false;
    if (req.cookies.JWT) {
        try {
            const decoded = jwt.verify(req.cookies.JWT, JWT_SECRET);
            isAdmin = decoded.is_admin === true;
        } catch (err) {
            console.error("JWT decode error in getsignup:", err.message);
        }
    }
    res.render('pages/signup', { isLoggedIn: !!req.cookies.JWT, isAdmin });
};

const getlogin = async (req, res) => {
    let isAdmin = false;
    if (req.cookies.JWT) {
        try {
            const decoded = jwt.verify(req.cookies.JWT, JWT_SECRET);
            isAdmin = decoded.is_admin === true;
        } catch (err) {
            console.error("JWT decode error in getlogin:", err.message);
        }
    }
    res.render("pages/signin", { isLoggedIn: !!req.cookies.JWT, isAdmin });
};

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.email.user,
            pass: config.email.pass,
        },
    });

    function generateStrongPassword(length = 12) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
        let password = "";
        const charsetLength = charset.length;

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charsetLength);
            password += charset[randomIndex];
        }

        return password;
    }

    const adduser = async (req, res) => {
        try {
            const { user_name, user_email } = req.body;

            if (!user_name || !user_email) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const autoPassword = generateStrongPassword();
            console.log("Generated Password:", autoPassword);

            // Check if user already exists
            const existingUser = await db.User.findOne({ where: { user_email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email is already registered." });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(autoPassword, 10);

            // Save user in DB
            const newUser = await db.User.create({
                user_name,
                user_email,
                user_password: hashedPassword,
            });

            // Email content
            const mailOptions = {
                from: config.email.user,
                to: user_email,
                subject: "Welcome to Travel App",
                text: `Hi ${user_name},\n\nYour account has been created successfully.\nPlease log in using your email ${user_email} and your password is ${autoPassword}\n\nThank you!`,
            };

            // Send welcome email
            try {
                await transporter.sendMail(mailOptions);
                console.log("Email sent to:", user_email);
            } catch (emailError) {
                console.error("Email sending failed:", emailError.message);
                // Optional: don't fail registration if email fails
            }

            res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    };

    const generateToken = (user_id, user_name, user_email, is_admin) => {
        return jwt.sign(
            { user_id, user_name, user_email, is_admin },
            process.env.JWT_SECRET || "tokensecret",
            { expiresIn: "1h" }
        );
    };

    const login = async (req, res) => {
        try {
            const { user_email, user_password } = req.body;
            console.log("Login attempt for:", user_email);

            if (!user_email || !user_password) {
                return res.status(400).json({
                    status: false,
                    error: "Email and password are required.",
                });
            }

            const userdetail = await db.User.findOne({ where: { user_email } });

            if (!userdetail) {
                console.log("User not found");
                return res.status(400).json({
                    status: false,
                    error: "Invalid email or password",
                });
            }

            const isMatch = await bcrypt.compare(user_password, userdetail.user_password);
            if (!isMatch) {
                console.log("Incorrect password");
                return res.status(400).json({
                    status: false,
                    error: "Invalid email or password",
                });
            }

            // Generate token
            const token = generateToken(userdetail.user_id, userdetail.user_name, userdetail.user_email, userdetail.is_admin);
            const tokenAge = 1000 * 60 * 60; // 1 hour

            res.cookie("JWT", token, {
                httpOnly: true,
                maxAge: tokenAge,
                secure: true,
                sameSite: "Strict",
            });

            console.log("JWT cookie set:", token);
            console.log("Login successful for:", user_email);

            return res.status(200).json({
                status: true,
                data: {
                    user_id: userdetail.user_id,
                    user_name: userdetail.user_name,
                    user_email: userdetail.user_email,
                    is_admin: userdetail.is_admin,
                },
            });
        } catch (err) {
            console.error("Login error:", err);
            return res.status(500).json({
                status: false,
                error: "Internal server error",
            });
        }
    };

    const logout = async (req, res) => {
        res.cookie("JWT", "", { maxAge: 1 });
        res.redirect("/");
    };

    module.exports = { getsignup, getlogin, adduser, login, logout };
