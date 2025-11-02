import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { dbConnect } from '@/db/dbConnect';
import { deleteFileById } from '@/lib/actions/fileActions';
import { findUserById } from '@/lib/actions/userActions';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request) {
  try {
    await dbConnect();

    const { fileId, fileCloudinaryId } = await request.json();

    if (!fileId || !fileCloudinaryId) {
      return NextResponse.json({ message: 'File ID and Cloudinary Public ID are required.' }, { status: 400 });
    }

    if (!deletedFile) {
      return NextResponse.json({ message: 'Document not found in database.' }, { status: 404 });
    }

    const cloudinaryResponse = await cloudinary.uploader.destroy(fileCloudinaryId, {
      resource_type: 'raw' // Use 'raw' for non-image files like PDFs
    });

    console.log('Cloudinary Deletion Response:', cloudinaryResponse);

    if (cloudinaryResponse.result === 'not found') {
        // Log, but proceed, as the file is gone from our DB anyway
        console.warn(`PDF with Public ID ${fileCloudinaryId} was not found on Cloudinary.`);
        return NextResponse.json({ 
          message: 'PDF record deleted from database, but file was not found on Cloudinary.', 
          cloudinaryResult: cloudinaryResponse
        }, { status: 200 });
    }

    const deletedFile = await deleteFileById(fileId);
    const User = await findUserById(deletedFile.uploadedByUser);
    User.uploads = User.uploads.filter(uploadId => uploadId.toString() !== fileId);
    await User.save();

    return NextResponse.json({ 
      message: 'PDF successfully deleted from Cloudinary and database.', 
      cloudinaryResult: cloudinaryResponse
    }, { status: 200 });

  } catch (error) {
    console.error('PDF Deletion API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}