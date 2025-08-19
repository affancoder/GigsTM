const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    personalInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        jobRole: String,
        gender: String,
        dob: Date
    },
    documents: {
        aadhaar: String,
        pan: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String
    },
    about: String,
    files: {
        aadhaarFile: String,
        panFile: String,
        profileImage: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
userProfileSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
