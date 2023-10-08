const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const fetchUser = require('../middleware/fetchuser');
const fetchAdmin = require('../middleware/fetchadmin');

const JWT_SECRET_USER = process.env.JWT_SECRET_USER;
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

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
                password: secPass,
                phone: req.body.phone
            });
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET_USER);

            console.log("New User Created Successfully")
            res.json({ authToken })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    },
);


// authenticate a user using: POST : "api/auth/user/login", No login required
router.post("/user/login",
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
    async (req, res) => {
        // to take care of errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;
        try{
            let user = await User.findOne({email});
            // check email
            if(!user){
                return res.status(400).json({error: "Please enter correct credentials."});
            }
            // check password
            const passCompare = await bcrypt.compare(password, user.password);
            if(!passCompare){
                return res.status(400).json({error: "Please enter correct credentials."});
            }

            const data = {
                user:{
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET_USER);
            res.json({authToken})
        }catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
});


// Get loggedin user details using: POST : "api/auth/getuser". Login required
router.post("/getuser", fetchUser, async(req,res) => {
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }catch (error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// create an admin using : POST : "api/auth/admin/signup", No login required
router.post(
    '/admin/signup',
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
            let admin = await Admin.findOne({ email: req.body.email });
            if (admin) {
                return res.status(400).json({ error: "Email is already registered" })
            }

            const salt = await bcrypt.genSalt(10);
            secPass = await bcrypt.hash(req.body.password, salt)
            // create a new admin
            admin = await Admin.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
                phone: req.body.phone
            });
            const data = {
                admin: {
                    id: admin.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET_ADMIN);

            console.log("New Admin Created Successfully")
            res.json({ authToken })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    },
);


// authenticate an admin using: POST : "api/auth/admin/login", No login required
router.post("/admin/login",
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
    async (req, res) => {
        // to take care of errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;
        try{
            let admin = await Admin.findOne({email});
            // check email
            if(!admin){
                return res.status(400).json({error: "Please enter correct credentials."});
            }
            // check password
            const passCompare = await bcrypt.compare(password, admin.password);
            if(!passCompare){
                return res.status(400).json({error: "Please enter correct credentials."});
            }

            const data = {
                admin:{
                    id: admin.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET_ADMIN);
            res.json({authToken})
        }catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
});


// Get loggedin admin details using: POST : "api/auth/getadmin". Login required
router.post("/getadmin", fetchAdmin, async(req,res) => {
    try{
        adminId = req.admin.id;
        const admin = await Admin.findById(adminId).select("-password");
        res.send(admin);
    }catch (error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
