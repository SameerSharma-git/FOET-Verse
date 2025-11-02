import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { addUser } from "@/lib/actions/userActions";
import { findUser } from "@/lib/actions/userActions";
import { set_JWT_Token } from "@/lib/actions/jwt_token";
import { cookies } from "next/headers";

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

        let role;
        if (email==="sameersharm1234@gmail.com") {
            role = "admin";
        } else {
            role = "user";
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let currentDate = Date.now()

        let newUser = await addUser({ name, email, password: hashedPassword, course, year, branch, semester, role, createdAt: currentDate, updatedAt: currentDate })
        const userData = newUser?.toObject()
        let token = await set_JWT_Token(userData)

        let cookieStore = await cookies()
        cookieStore.set('jwt_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use this for prod/dev
            maxAge: 60 * 60, // 1 hour
            path: '/',
            sameSite: 'Lax',
        });

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