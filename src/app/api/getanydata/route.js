import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const cookies = request.cookies;

    const scribeToken = cookies.get("scribetoken");
    const studentToken = cookies.get("studenttoken");

    const st = studentToken?.value;

    if(st){
        return NextResponse.json("Student");
    }

    const sct = scribeToken?.value;

    if(sct){
        return NextResponse.json("Scribe");
    }

    return NextResponse.json("no");

   
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
