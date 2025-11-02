"use server"
import { cookies } from 'next/headers';

export default async function setCookie(cookieName, value) {
  const cookieStore = await cookies()
    cookieStore.set(cookieName, value, {
    httpOnly: true, // Recommended: Prevents client-side JavaScript access
    // secure: process.env.NODE_ENV === 'production', // Recommended: Only send over HTTPS in production
    secure: false, //process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    maxAge: 60 * 60 ,
    path: '/', // The path for which the cookie is valid
    sameSite: 'Lax', // Recommended for CSRF protection
  });
  console.log(`Set value-${value} to cookie-${cookieName}`)
}