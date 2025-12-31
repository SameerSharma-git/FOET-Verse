import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { addUser } from "@/lib/actions/userActions";
import { findUser } from "@/lib/actions/userActions";
import { set_JWT_Token } from "@/lib/actions/jwt_token";
import { cookies } from "next/headers";
import getRandomProfilePic from "@/lib/randomProfile";
import { sendEmailAction } from "@/lib/actions/emailActions";

export async function POST(req) {
    try {
        const { name, email, password, course, year, branch, semester } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 } // Bad Request
            );
        }

        const existingUser = await findUser({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 } // Conflict
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let currentDate = Date.now();
        const randProfilePic = getRandomProfilePic();

        const admins = ["sameersharm1234@gmail.com","s3706178@gmail.com", "sarthakshukla479@gmail.com" , "singhsheersh588@gmail.com"];
        const role = admins.includes(email) ? "admin" : "user";

        let newUser = await addUser({ name, profilePicture: randProfilePic, email, password: hashedPassword, course, year, branch, semester, role, createdAt: currentDate, updatedAt: currentDate })
        const userData = newUser?.toObject()
        let token = await set_JWT_Token(userData)

        let cookieStore = await cookies()
        cookieStore.set('jwt_token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Use this for prod/dev
            maxAge: 60 * 60 * 24 * 5, // 5 Days
            path: '/',
            sameSite: 'Lax',
        });

        console.log(`${newUser.name} with email - ${newUser.email} Signed up!`);

        const htmlContent = `<p>New user - ${newUser.name} with email - ${newUser.email} just signed up to FOET-Verse!</p>`
        sendEmailAction({to: "sameersharm1234@gmail.com", subject: "New User Signed up to FOET-Verse", htmlContent})

        return NextResponse.json(
            { message: 'User created successfully', user: newUser },
            { status: 201 } // Created
        );
    } catch (error) {
        console.error('Signup API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}