"use server"
import { dbConnect } from "@/db/dbConnect";
import User from "@/db/Schemas/userSchema";

async function findUser(params) {
  try {
    await dbConnect(); // Connect to the database
    let foundUser = JSON.parse(JSON.stringify(await User.findOne(params)))
    if (foundUser) {
        return foundUser
    }
    
    return null
  } catch (error) {
    console.error('Error occurred while fetching user from the database:', error);
  }
}

async function findUserById(id) {
  try {
    await dbConnect(); // Connect to the database
    let foundUser = JSON.parse(JSON.stringify(await User.findById(id)))
    if (foundUser) {
        return foundUser
    }
    
    return null
  } catch (error) {
    console.error('Error occurred while fetching user from the database:', error);
  }
}

async function findMongoUserById(id) {
  try {
    await dbConnect(); // Connect to the database
    let foundUser = await User.findById(id)
    if (foundUser) {
        return foundUser
    }
    
    return null
  } catch (error) {
    console.error('Error occurred while fetching user from the database:', error);
  }
}


async function addUser({name, email, password, course, year, branch, role,semester, createdAt, updatedAt}) {
  try {
    await dbConnect(); // Connect to the database
    let newUser = new User({name, email, password, course, year, branch, role, semester, createdAt, updatedAt}) 
    await newUser.save()
    return newUser
    
  } catch (error) {
    console.error('Error occurred while adding user to the database:', error);
  }
}

export {findUser, findUserById, findMongoUserById, addUser};