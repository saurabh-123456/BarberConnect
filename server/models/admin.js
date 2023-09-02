const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: Number,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Manager'],
        default: 'Admin'
    }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
