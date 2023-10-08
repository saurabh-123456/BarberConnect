const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: Number,
        // required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'staff'],
        default: 'user'
    },
    otp: {
        type: Number
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
