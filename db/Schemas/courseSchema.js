import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: [true, 'Course is required'],
    },
    Branches: [
        {
            type: String,
            required: false,
        },
    ],
    subjects: [
        {
            type: Object,
        }
    ],
    files: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            unique: true
        }
    ],
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course