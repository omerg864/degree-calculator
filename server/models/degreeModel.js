import mongoose from 'mongoose';

const degreeScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Degree', degreeScheme);