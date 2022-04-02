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

//
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

module.exports = router