import { connect } from "../../../../lib/dbconnect";
import { NextResponse } from "next/server";
import scribemodel from "../../../../models/scribe";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  try {
    // Parse request body
    const reqbody = await request.json();
    console.log(reqbody);
    const { availableDates , userId } = reqbody
    // const { aadhaarNumber, password } = reqbody;

    // console.log(reqbody, "Request Body");
    // console.log(aadhaarNumber, "Aadhaar Number");

    // // Find student by Aadhaar number
    // const scb = await scribemodel.findOne({ aadhaarNumber });
    // console.log(scb, "scribe Found");

    // // If student not found, redirect to signup
    // if (!scb) {
    //   return NextResponse.redirect("/scribesignup");
    // }

    // // Plain text password check (not secure for production)
    // const validpass = scb.password === password;
    // console.log(validpass, "Is Password Valid");

    // if (!validpass) {
    //   return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    // }

    // // Create JWT payload
    // const tokendata = {
    //   scbaadhar: scb.aadhaarNumber,
    //   id: scb._id,
    //   role:"scribe"
    // };

    // // Sign JWT token
    // const token = jwt.sign(tokendata, process.env.TOKEN_SECRET, {
    //   expiresIn: "1d",
    // });

    // // Create response and set cookie
    // const response = new NextResponse(
    //   JSON.stringify({ message: "Login successful" }),
    //   {
    //     status: 200,
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );

    // // Set cookie in the response
    // response.cookies.set({
    //   name: "scribetoken",
    //   value: token,
    //   httpOnly: true,
    //   maxAge: 60 * 60 * 24, // 1 day
    //   path: "/",
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    // });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
