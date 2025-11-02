import { dbConnect } from "@/db/dbConnect";
import UploadData from "@/db/Schemas/uploadDataSchema";

export async function addUploadData({ original_File_Name, cloudinary_Public_Id, fileType, secure_url, uploadedByUser, uploadedAt }) {
    try {
        await dbConnect(); // Connect to the database
        let newUploadData = new UploadData({ original_File_Name, cloudinary_Public_Id, fileType, secure_url, uploadedByUser, uploadedAt }) 
        await newUploadData.save()
        return newUploadData
    } catch (error) {
        console.error('Error occurred while adding upload data to the database:', error);
    }
}