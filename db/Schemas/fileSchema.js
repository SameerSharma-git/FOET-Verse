import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    original_File_Name: {
        type: String,
        required: [true, 'Original_File_Name is required'],
    },
    cloudinary_Public_Id: {
        type: String,
        required: [true, 'Cloudinary_Public_Id is required'],
    },
    secure_url: {
        type: String,
        required: [true, 'Secure_URL is required'],
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
    },
    Branch: {
        type: String,
        required: false,
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
    },
    year: {
        type: Number,
        required: false,
    },
    semester: {
        type: Number,
        required: false,
    },
    resource_type: {
        type: String,
        enum: ['notes', 'PYQ', 'DPP', 'syllabus', 'marking-scheme', 'prev-year-paper', 'other'],
    },
    comments: [
        {
            type: Object,
            default: {},
        }
    ],
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }
    ],
    downvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }
    ],
    reports: [
        {
            type: Object,
            default: [],
        }
    ],
    uploadedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    uploadedAt: {
        type: Date,
        default: Date.now(),
    },
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File