const mongoose = require('mongoose')
const { Schema } = mongoose;

const bookSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    bookDetails: {
        bookName: {
            type: String,
            required: true
        },
        authorName: {
            type: String
        },
        yearPublish: {
            type: Number
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            required: true
        }
    },
    ownerDetails: {
        phone: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        address: {
            street: {
                type: String
            },
            landmark: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            district: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            pincode: {
                type: Number,
                required: true
            }
        }
    },
    bankDetails: {
        upi: {
            type: String
        },
        bankAccount: {
            IFSC: {
                type: String,
            },
            AccountNo: {
                type: String
            },
            holderName: {
                type: String,
            }
        }
    },
    pickup: {
        type: Boolean
    },
    paymentDone: {
        type: Boolean
    }
}, { timestamps: true })

const Book = mongoose.model('book', bookSchema);
module.exports = Book