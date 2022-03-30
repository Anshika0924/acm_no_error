const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI
// const mongoURI = "mongodb+srv://Mohit27:Mohit@27@cluster0.4jeeu.mongodb.net/RiceMill_Management?retryWrites=true&w=majority"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected To Mongo Successfully");
    })
}

module.exports = connectToMongo