import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { dbConnect } from '@/db/dbConnect';
import { deleteFileById } from '@/lib/actions/fileActions';
import { findMongoUserById, updateUser } from '@/lib/actions/userActions';

export async function DELETE(request) {
  try {
    await dbConnect();

    const { fileId, fileCloudinaryId } = await request.json();

    if (!fileId || !fileCloudinaryId) {
      return NextResponse.json({ message: 'File ID and Cloudinary Public ID are required.' }, { status: 400 });
    }

    const cleanId = fileCloudinaryId.replace(/\.[^/.]+$/, "");

    const cloudinaryResponse = await cloudinary.uploader.destroy(cleanId, {
      // resource_type: 'raw', // Use 'raw' for non-image files like PDFs
      invalidate: true
    });


    if (cloudinaryResponse.result === 'not found') {
      // Log, but proceed, as the file is gone from our DB anyway
      console.warn(`PDF with Public ID ${fileCloudinaryId} was not found on Cloudinary.`);
      return NextResponse.json({
        message: 'PDF record deleted from database, but file was not found on Cloudinary.',
        cloudinaryResult: cloudinaryResponse
      }, { status: 200 });
    }

    const deletedFile = await deleteFileById(fileId);

    if (!deletedFile) {
      return NextResponse.json({ message: 'Document not found in database.' }, { status: 404 });
    }

    await updateUser({ _id: deletedFile.uploadedByUser }, { $pull: { uploads: deletedFile._id } });

    return NextResponse.json({
      message: 'PDF successfully deleted from Cloudinary and database.',
      cloudinaryResult: cloudinaryResponse
    }, { status: 200 });

  } catch (error) {
    console.error('PDF Deletion API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}