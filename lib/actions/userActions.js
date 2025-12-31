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

async function deleteUser(params) {
  try {
    await dbConnect(); // Connect to the database
    let foundUser = JSON.parse(JSON.stringify(await User.findOneAndDelete(params)))
    if (foundUser) {
        return foundUser
    }
    
    return null
  } catch (error) {
    console.error('Error occurred while fetching user from the database:', error);
  }
}

async function findUsers(params) {
  try {
    await dbConnect(); // Connect to the database
    let foundUser = JSON.parse(JSON.stringify(await User.find(params)))
    if (foundUser) {
        return foundUser
    }
    
    return null
  } catch (error) {
    console.error('Error occurred while fetching user from the database:', error);
  }
}

async function updateUser(params, update) {
  try {
    await dbConnect(); // Connect to the database
    let foundUser = JSON.parse(JSON.stringify(await User.findOneAndUpdate(params, update)))
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
    let foundUser = JSON.parse(JSON.stringify(await User.findById(id)));
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

async function updateUserUp_Down_comments(userId, type, input, bool) {
  try {
    await dbConnect();
    let foundUser = await User.findById(userId);

    if (foundUser) {
      if (type === "upvote") {
        if(bool){
          updateUser({_id: userId}, {$pull: {upvotes: input}});
        } else {
          updateUser({_id: userId}, {$addToSet: {upvotes: input}});
        }
      } else if (type === "downvote") {
        if(bool){
          updateUser({_id: userId}, {$pull: {downvotes: input}});
        } else {
          updateUser({_id: userId}, {$addToSet: {downvotes: input}});
        }
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export {findUser, deleteUser, findUsers, updateUser, findUserById, findMongoUserById, addUser, updateUserUp_Down_comments};