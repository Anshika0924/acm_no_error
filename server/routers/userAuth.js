const express = require("express")
const router = express.Router();

const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const { body, validationResult } = require("express-validator");

//bcrpt
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

//jsonwebtoken
const jwt = require('jsonwebtoken');

//importing schema
const User = require('../models/userModels');

router.use(bodyParser.json())
router.use(cookieParser());

//user register api running at: http://localhost:5000/api/auth/register
router.post("/register",
    //validating email
    body('email').isEmail(),
    //check length of password
    body('password').isLength({ min: 6 }),
    //checking length of phone number
    body('phone').isLength({ min: 10 }),
    async (req, res) => {
        console.log("Incoming Requests for registering user");

        //checking for validation error
        const errors = validationResult(req);

        //if error exsists through error
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }

        const { email, password, phone, name } = req.body;

        if(!(email && password && phone && name)) {
            return res.status(400).json({ error: "Filled required credentials" })
        }

        //checking if email already exists
        User.findOne({ email: email })
            .then((user) => {
                //finding user in db
                if (user !== null) {
                    //throughing error of already exsisting email
                    return res.status(400).json({ error: "User email already exsits" })
                }

                //hashing password
                const hashPassword = bcrypt.hashSync(password, salt);

                //saving user in db
                User.create({
                    name: name,
                    email: email,
                    password: hashPassword,
                    phone: phone
                })
                    .then((user) => {
                        //creating jwt token
                        const userToken = jwt.sign({ user: user }, "workinginacmasteam:no_error");

                        //saving cookie
                        res.cookie("userToken", userToken, {
                            "httpOnly": true
                        })

                        //throughing success status
                        return res.status(200).json({ userToken: userToken })
                    })
                    .catch((err) => {
                        //through error if cannot create user
                        return res.status(400).json({ error: "Error in creating user" })
                    })
            })
            .catch((err) => {
                //throughing internal error
                return res.status(500).json({ error: "Internal server Error" })
            })

    }
)

//user login api running at: http://localhost:5000/api/auth/login
router.post("/login",
    //check for email
    body('email').isEmail(),
    //check for password length
    body('password').isLength({ min: 6 }),
    async (req, res) => {
        console.log("Incoming request for login");

        //checking for errors
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            //returning errors
            return res.status(400).json({ error: "Invalid Credentials" })
        }

        const {email, password} = req.body;

        ///checking if email and password exsists or not
        if(!(email && password)) {
            return res.status(400).json({ error: "Filled Required Credentials" })
        }

        User.findOne({ email: email })
        .then((user) => {

            //response if user's email is not found
            if(user === null) {
                return res.status(400).json({ error: "User's email is not register. Please first register user" })
            }

            // //check password
            const flag = bcrypt.compareSync(password, user.password);

            if(!flag) {
                return res.status(400).json({ error: "Invalid Credentials" })
            }

            //creating jwt token
            const userToken = jwt.sign({ user: user }, "workinginacmasteam:no_error");

            //creating cookie
            res.cookie("userToken", userToken, {
                "httpOnly": true
            })

            //responsing success status
            return res.status(200).json({ userToken: userToken })
        })
        .catch((err) => {
            //responsing internal server error
            return res.status(500).json({ error: "Internal Server Error" })
        })

    }
)

module.exports = router