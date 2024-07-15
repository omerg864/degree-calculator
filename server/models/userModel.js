import mongoose from 'mongoose';

const userScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    degree: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
}, { timestamps: true });

export default mongoose.model('User', userScheme);