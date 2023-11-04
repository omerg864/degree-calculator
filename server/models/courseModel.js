import mongoose from 'mongoose';

const courseScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignments: [{
        name: {
            type: String,
            required: true
        },
        percent: {
            type: Number,
            required: true
        },
        grade: {
            type: Number,
            required: false
        },
    }],
    points: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    grade: {
        type: Number,
        required: false
    },
    binaryPass: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Course', courseScheme);