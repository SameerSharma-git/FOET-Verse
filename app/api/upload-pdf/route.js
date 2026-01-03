import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sendEmailAction } from '@/lib/actions/emailActions';
import { addFile } from '@/lib/actions/fileActions';
import { decodeJWT } from '@/lib/actions/jwt_token';
import { findMongoUserById, updateUser } from '@/lib/actions/userActions';
import { addUploadData } from '@/lib/actions/uploadDataActions';

// Max file size check (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Converts a File object's buffer to a Base64 Data URI for programmatic upload. */
async function bufferToDataURI(buffer, mimeType) {
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${mimeType};base64,${base64}`;
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        const userPayload = await decodeJWT();

        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        //  EXTRACT FILE AND METADATA FROM FORM DATA
        const file = formData.get('file');
        const fileName = formData.get('fileName');
        const orignial_file_name = file.name;
        const branch = formData.get('branch');
        const subject = formData.get('subject');
        const year = formData.get('year');
        const semester = formData.get('semester');
        const resource_type = formData.get('resource_type');

        if (!file) {
            return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
        }
        if (!branch || !subject) {
            return NextResponse.json({ error: 'Missing mandatory metadata: Branch or Subject.' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Invalid file type. Only PDF is allowed.' }, { status: 403 });
        }
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 413 });
        }

        const fileBuffer = await file.arrayBuffer();
        const dataUri = await bufferToDataURI(fileBuffer, file.type);
        const uniqueFileName = `${uuidv4()}`;


        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'foet-verse/study-resources',
            resource_type: 'auto',
            type: 'upload',
            public_id: uniqueFileName,
            overwrite: false,
        });


        if (!uploadResult || !uploadResult.secure_url) {
            console.error('Cloudinary upload failed.');
            return NextResponse.json({ error: "File upload failed to external storage." }, { status: 500 });
        }

        const notesUrl = uploadResult.secure_url;
        const cloudinaryPublicId = uploadResult.public_id;

        // Send Email to User
        let emailSendAction;
        const emailParameters = {
            to: "sameersharm1234@gmail.com",
            subject: "File Uploaded Successfully",
            htmlContent: `<h2>A file has been uploaded successfully on FOET-Verse!</h2><p>Cloudinary Id: ${cloudinaryPublicId}, secure URL: ${notesUrl} and fileName: ${orignial_file_name}</p>`
        }
        sendEmailAction(emailParameters)
            .then(result => emailSendAction = result)


        // Save File Metadata to Database
        addFile({
            original_File_Name: fileName,
            secure_url: notesUrl,
            cloudinary_Public_Id: cloudinaryPublicId,
            course: "Btech",
            subject: subject,
            Branch: branch,
            year: year,
            semester: semester,
            resource_type: resource_type,
            uploadedByUser: userPayload._id,
        }).then(addedFile => {

            updateUser({ _id: userPayload._id }, { $addToSet: { uploads: addedFile.file_id } })
            findMongoUserById(userPayload._id)
                .then(user => {
                    user.uploads.push(addedFile._id);
                    user.save();
                }).catch(userUpdateError => {
                    console.error("Error updating user's uploads array:", userUpdateError);
                });
        });


        addUploadData({
            original_File_Name: fileName,
            cloudinary_Public_Id: cloudinaryPublicId,
            fileType: "pdf",
            secure_url: notesUrl,
            uploadedByUser: userPayload._id,
            uploadedAt: Date.now(),
        }).then(addedUploadData => {
        }).catch(uploadDataError => {
            console.error("Error adding upload data record:", uploadDataError);
        });

        // Success: Respond with status and the URL for confirmation
        return NextResponse.json({
            message: 'Upload and save successful',
            url: notesUrl,
            publicId: cloudinaryPublicId,
        }, { status: 201 });

    } catch (error) {
        console.error('Submission failure details:', error);
        return NextResponse.json({
            error: error.message || 'An internal server error occurred during submission.'
        }, { status: 500 });
    }
}