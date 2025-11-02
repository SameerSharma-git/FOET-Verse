import mongoose from 'mongoose';

const profilePicSchema = new mongoose.Schema({
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
    uploadedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    uploadedAt: {
        type: Date,
        default: Date.now(),
    },
});

const ProfilePic = mongoose.models.ProfilePic|| mongoose.model('ProfilePic', profilePicSchema);
export default ProfilePic