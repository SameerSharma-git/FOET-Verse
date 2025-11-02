import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get('jwt_token');
  jwtToken && console.log("Fetched toke is: ", jwtToken.value)

  // You might also want to verify the token here if it's a JWT
  const isAuthenticated = !!jwtToken?.value;
  console.log(isAuthenticated)
  return NextResponse.json({ isAuthenticated });
}