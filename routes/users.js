const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const config = require("config");

//Routes go here
router.post(
    "/register",
    [
        check("email", "Invalid email").isEmail(),
        check("name", "Name is required").notEmpty(),
        check("password", "Password must be 6 chars long").isLength({ min: 6 }),
        check("mobile", "Invalid mobile number").isLength({ min: 10, max: 10 }),
        check("aadhar_card", "Invalid aadhar number").isLength({
            min: 14,
            max: 14,
        }),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const { email, name, password, mobile, aadhar_card } = req.body;

        try {
            var user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ error: [{ msg: "User already exists" }] });
            }

            var user = await User.findOne({ mobile });
            if (user) {
                return res
                    .status(400)
                    .json({ error: [{ msg: "User already exists" }] });
            }

            var user = await User.findOne({ aadhar_card });
            if (user) {
                return res
                    .status(400)
                    .json({ error: [{ msg: "User already exists" }] });
            }

            user = new User({
                email,
                name,
                password,
                mobile,
                aadhar_card,
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            return res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

router.post(
    "/login",
    [
        check("email", "Invalid email").isEmail(),
        check("password", "Password is required").notEmpty(),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ error: [{ msg: "Invalid Credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ error: [{ msg: "Invalid Credentials" }] });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: "7d" },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
