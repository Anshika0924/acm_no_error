const express = require('express')
const router = express.Router();

const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator')

const Book = require('../models/bookModel');

router.use(bodyParser.json())

//register selling Book api running at: http://localhost:5000/api/selling/registerBook
router.post('/registerBook', async(req, res) => {
    console.log("Incoming request for register selling Book");

    const { userID, bookDetails, ownerDetails } = req.body;

    //checking for required data
    if(!(userID && bookDetails.bookName && bookDetails.price && ownerDetails.phone && ownerDetails.name && ownerDetails.address.landmark && ownerDetails.address.city && ownerDetails.address.district && ownerDetails.address.state && ownerDetails.address.pincode )) {
        //returning error if required things are not present
        return res.status(400).json({ error: "Plzz, fill the require document" })
    }

    //creating selling book in db
    Book.create({
        userID: userID,
        bookDetails: bookDetails,
        ownerDetails: ownerDetails
    })
    .then((book) => {
        //returning success status
        return res.status(200).json({ registerBook: book })
    })
    .catch((err) => {
        //returning error in creating User
        return res.status(400).json({ error: err })
    })
})

module.exports = router