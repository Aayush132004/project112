// import jwt from "jsonwebtoken";
// import { NextRequest, NextResponse } from "next/server";


// export async function POST(request) {
//     try {
//         const token = await request.cookies.get("scribetoken").value ||request.cookies.get("studenttoken").value ||'';
//         console.log(token ,"token");
//         const decodedtoken = await jwt.verify(token , process.env.TOKEN_SECRET);
//         // console.log(decodedtoken.id , "decoded token");
        
//         return NextResponse.json({token , decodedtoken});
//     } catch (error) {
//         throw new   Error(error.message);
//     }
// }

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const cookies = request.cookies;

    const scribeToken = cookies.get("scribetoken");
    const studentToken = cookies.get("studenttoken");

    const token = scribeToken?.value || studentToken?.value || '';

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const decodedtoken = jwt.verify(token, process.env.TOKEN_SECRET);

    return NextResponse.json({ token, decodedtoken });
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
