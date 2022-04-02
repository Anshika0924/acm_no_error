const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        }
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)

const User = mongoose.model('user', userSchema);
module.exports = User