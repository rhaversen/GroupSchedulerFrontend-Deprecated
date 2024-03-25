import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // Send status 200 and 'OK' as the response
    return NextResponse.json('OK')
}