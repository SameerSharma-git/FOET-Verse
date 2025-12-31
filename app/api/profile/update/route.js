import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import User from '@/db/Schemas/userSchema';
import { dbConnect } from '@/db/dbConnect';
import bcrypt from "bcrypt";
import ProfilePic from '@/db/Schemas/profilePictureSchema';

export async function PUT(request) { // Use PUT for updates
  try {
    await dbConnect(); // Connect to your MongoDB database

    const formData = await request.formData();

    const userId = formData.get('_id');
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required for updating profile.' }, { status: 400 });
    }

    // Initialize updateData with fields that are always present
    const updateData = {
      name: formData.get('name'),
      email: formData.get('email'),
      branch: formData.get('branch'),
      year: parseInt(formData.get('year')),
      semester: parseInt(formData.get('semester')),
    };

    // Handle Password (only if provided)
    const password = formData.get('password');
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Handle Profile Picture
    const profilePictureFile = formData.get('profilePicture'); // This will be a File object or a string ('null', or existing URL)


    // Case 1: A new file was uploaded
    if (profilePictureFile instanceof File && profilePictureFile.size > 0) {

      const existingProfilePic = await ProfilePic.findOne({ uploadedByUser: userId });
      if (existingProfilePic) {
        cloudinary.uploader.destroy(existingProfilePic.cloudinary_Public_Id, {
          resource_type: 'image'
        });
        existingProfilePic.deleteOne();
      }

      const arrayBuffer = await profilePictureFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: 'foet-verse/profile_pictures', // Optional: specify a folder
          resource_type: 'image',
        }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(buffer);
      });
      updateData.profilePicture = result.secure_url;

      const newProfilePicture = new ProfilePic({
        original_File_Name: profilePictureFile.name,
        cloudinary_Public_Id: result.public_id,
        secure_url: result.secure_url,
        uploadedByUser: userId,
      });
      newProfilePicture.save();


      
    } else if (profilePictureFile === 'null' || profilePictureFile === '') {
      updateData.profilePicture = null; // Set to null in DB to remove the picture
    }


    // Find and update user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(userId, { ...updateData, updatedAt: Date.now() }, { new: false, runValidators: true });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Prepare response (exclude sensitive data)
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return NextResponse.json({
      message: 'Profile updated successfully!',
      user: userResponse,
      // Provide the URL that the client should now display (new Cloudinary URL, or null if cleared, or old one if unchanged)
      newProfilePictureUrl: updatedUser.profilePicture || null
    }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}