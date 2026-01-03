import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sendEmailAction } from '@/lib/actions/emailActions';
import { addFile } from '@/lib/actions/fileActions';
import { decodeJWT } from '@/lib/actions/jwt_token';
import { updateUser } from '@/lib/actions/userActions';
import { addUploadData } from '@/lib/actions/uploadDataActions';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function bufferToDataURI(buffer, mimeType) {
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${mimeType};base64,${base64}`;
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const userPayload = await decodeJWT();

        if (!userPayload?._id) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        // 1. Extract and Validate
        const file = formData.get('file');
        const fileName = formData.get('fileName');
        const branch = formData.get('branch');
        const subject = formData.get('subject');
        const year = formData.get('year');
        const semester = formData.get('semester');
        const resource_type = formData.get('resource_type');

        if (!file || !branch || !subject) {
            return NextResponse.json({ error: 'Missing file or mandatory metadata.' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Invalid file type. Only PDF is allowed.' }, { status: 403 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 413 });
        }

        // 2. Process File for Cloudinary
        const fileBuffer = await file.arrayBuffer();
        const dataUri = await bufferToDataURI(fileBuffer, file.type);
        const uniqueFileName = uuidv4();

        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'foet-verse/study-resources',
            resource_type: 'auto',
            public_id: uniqueFileName,
        });

        if (!uploadResult?.secure_url) {
            throw new Error('Cloudinary upload failed.');
        }

        const notesUrl = uploadResult.secure_url;
        const cloudinaryPublicId = uploadResult.public_id;

        // 3. Database Operations (Awaited for consistency)
        // We use Promise.all to run these in parallel for better performance
        const [addedFile] = await Promise.all([
            addFile({
                original_File_Name: fileName,
                secure_url: notesUrl,
                cloudinary_Public_Id: cloudinaryPublicId,
                course: "Btech",
                subject,
                Branch: branch,
                year,
                semester,
                resource_type,
                uploadedByUser: userPayload._id,
            }),
            addUploadData({
                original_File_Name: fileName,
                cloudinary_Public_Id: cloudinaryPublicId,
                fileType: "pdf",
                secure_url: notesUrl,
                uploadedByUser: userPayload._id,
                uploadedAt: new Date(),
            }),
            // Optional: Send email without blocking the response if you prefer speed
            sendEmailAction({
                to: "sameersharm1234@gmail.com",
                subject: "File Uploaded Successfully",
                htmlContent: `<p>File <b>${fileName}</b> uploaded. <a href="${notesUrl}">View File</a></p>`
            })
        ]);

        // 4. Link File to User (Single efficient update)
        // Ensure addedFile contains the new _id from MongoDB
        if (addedFile?._id) {
            await updateUser(
                { _id: userPayload._id }, 
                { $addToSet: { uploads: addedFile._id } }
            );
        }

        return NextResponse.json({
            message: 'Upload and save successful',
            url: notesUrl,
            publicId: cloudinaryPublicId,
        }, { status: 201 });

    } catch (error) {
        console.error('Submission failure details:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}