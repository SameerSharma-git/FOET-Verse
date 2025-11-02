"use server";

import { dbConnect } from "@/db/dbConnect";
import File from "@/db/Schemas/fileSchema";

async function findFiles(params) {
  try {
    await dbConnect();
    let foundFiles = await File.find(params); 

    if (foundFiles && foundFiles.length > 0) {
        return JSON.parse(JSON.stringify(foundFiles));
    }
    
    return null;
  } catch (error) {
    console.error('Error occurred while fetching file from the database:', error);
    return null; 
  }
}

async function deleteFileById(_id) {
  try {
    await dbConnect();
    let foundFile = (await File.findOneAndDelete({ _id })).lean();

    if (foundFile) {
        return JSON.parse(JSON.stringify(foundFile));
    }
    
    return null;
  } catch (error) {
    console.error('Error occurred while deleting file from the database:', error);
    return null; 
  }
}

async function findFileById(id) {
  try {
    await dbConnect();
    let foundFile = await File.findById(id).lean();
    
    if (foundFile) {
        return JSON.parse(JSON.stringify(foundFile));
    }
    
    return null;
  } catch (error) {
    console.error('Error occurred while fetching file by ID from the database:', error);
    return null;
  }
}

async function addFile(fileData) {
  const {
      original_File_Name,
      secure_url,
      cloudinary_Public_Id,
      course,
      subject,
      Branch, // Optional
      year: year,     // Optional
      semester, // Optional
      resource_type,
      uploadedByUser,
      // uploadedAt, comments, upvotes, downvotes, reports use defaults or should be handled by server/other actions
  } = fileData;

  try {
    await dbConnect();
    
    // Create a new File instance
    let newFile = new File({ 
        original_File_Name, 
        secure_url, 
        cloudinary_Public_Id, 
        course, 
        subject, 
        Branch, 
        year, 
        semester,
        uploadedByUser,
        uploadedAt: Date.now(),
        comments: [],
    }); 
    
    await newFile.save();
    console.log('File added successfully:', newFile._id);

    return JSON.parse(JSON.stringify(newFile));
    
  } catch (error) {
    console.error('Error occurred while adding file to the database:', error);
    return null;
  }
}

export { findFiles, findFileById, addFile, deleteFileById };