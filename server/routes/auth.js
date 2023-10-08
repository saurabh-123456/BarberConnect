const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

const JWT_SECRET_USER = process.env.JWT_SECRET_USER;

const User = require("../models/User");
const Admin = require("../models/Admin");


// create a user using : POST : "api/auth/user/signup", No login required
router.post(
    '/user/signup',
    body('email', 'Enter a valid email Id').isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body('password', "Password must be atleast 6 characters").isLength({ min: 6 }),
    async (req, res) => {
        // to take care of errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // if a password has been provided, then a confirmation must also be provided.
        const { password } = validationResult(req);
        if (password) {
            await body('passwordConfirmation')
                .equals(password)
                .withMessage('passwords do not match')
                .run(req);
        }

        try {
            // check whether the email already registered
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "Email is already registered" })
            }

            const salt = await bcrypt.genSalt(10);
            secPass = await bcrypt.hash(req.body.password, salt)
            // create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            });
            const data = {
                user:{
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET_USER);

            console.log("New User Created Successfully")
            res.json({authToken})
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some Error Occured");
        }
    },
);

module.exports = router;
