// import { connect } from "../../../../lib/dbconnect";
// import { NextResponse } from "next/server";
// import studentmodel from "../../../../models/student";
// import bycrypt from "bcryptjs"
// import jwt from 'jsonwebtoken'

// connect()
// export async function POST(request) {
//     try {
//         const reqbody = await request.json();
//         console.log(reqbody , "reqbody");
//         const {aadhaarNumber, password} = reqbody;
//         console.log( aadhaarNumber);
//         const std = await studentmodel.findOne({aadhaarNumber : aadhaarNumber});
//         console.log( std , "model");
//         if(!std){
//           return NextResponse.redirect("/studentsignup");
//         }
       
//         const validpass = (std.password == password);
//         console.log(validpass , "is valid");
//         if( !validpass){
//             return NextResponse.json({message : "wrong password"})
//         }

//         const tokendata = {
//             stdaadhar : std.aadhaarNumber,
//             id : std._id
//         }
//         const token = await jwt.sign(tokendata , process.env.TOKEN_SECREAT,{expiresIn : '1d'} );
         
//         const response = NextResponse.json({message : "login sucess fully"})

//         response.cookies.set("studenttoken", token , {httpOnly : true})
//         return response;

//         // return NextResponse.json("good");

        
//     } catch (error) {
//         return NextResponse.json({err : error});
//     }
// }

import { connect } from "../../../../lib/dbconnect";
import { NextResponse } from "next/server";
import studentmodel from "../../../../models/student";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  try {
    // Parse request body
    const reqbody = await request.json();
    const { aadhaarNumber, password } = reqbody;

    console.log(reqbody, "Request Body");
    console.log(aadhaarNumber, "Aadhaar Number");

    // Find student by Aadhaar number
    const std = await studentmodel.findOne({ aadhaarNumber });
    console.log(std, "Student Found");

    // If student not found, redirect to signup
    if (!std) {
      return NextResponse.redirect("/studentsignup");
    }

    // Plain text password check (not secure for production)
    const validpass = std.password === password;
    console.log(validpass, "Is Password Valid");

    if (!validpass) {
      return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    }

    // Create JWT payload
    const tokendata = {
      stdaadhar: std.aadhaarNumber,
      id: std._id,
      role:"student"
    };

    // Sign JWT token
    const token = jwt.sign(tokendata, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Create response and set cookie
    const response = new NextResponse(
      JSON.stringify({ message: "Login successful" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Set cookie in the response
    response.cookies.set({
      name: "studenttoken",
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
