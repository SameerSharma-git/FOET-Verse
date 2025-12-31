import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    let cookieStore = await cookies()
    cookieStore.set('jwt_token', null, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use this for prod/dev
        maxAge: 60 * 60, // 1 hour
        path: '/',
        sameSite: 'Lax',
    });

    return NextResponse.json({jwt_token: cookieStore.get('jwt_token')})
}