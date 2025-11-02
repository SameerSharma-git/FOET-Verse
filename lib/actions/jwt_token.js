"use server"
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '1h';

export async function set_JWT_Token(userPayload) {
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return token
}

export async function decodeJWT() {
  const cookieStore = await cookies()
  const token =  cookieStore.get('jwt_token')? cookieStore.get('jwt_token').value: null
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Token is valid! Decoded Payload");
      return decoded
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return null
    }
  }
  else{
    console.log("No token. Please login!!!!")
    return null
  }
}