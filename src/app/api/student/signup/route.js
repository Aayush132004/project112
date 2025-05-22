import { connect } from "../../../../lib/dbconnect"
import { NextResponse } from "next/server";
import studentmodel from '../../../../models/student'
import bycrypt from "bcryptjs"
connect()
export async function POST(request) {
    try {
        const reqbody =  await request.json();
        console.log(reqbody , "hi");
        const {
            aadhaar,
            fullName,
            mobile,
            email,
            state,
            district,
            institution,
            educationLevel,
            disability,
            password,
            confirmPassword

          } = reqbody;
    //     const { name , phone  , email, city ,password } = reqbody;
       console.log(aadhaar , "aadhar");


        const  std = await studentmodel.findOne({aadhaarNumber : aadhaar});
        if(std){
            console.log("std already present" , std)
            return NextResponse.json({error : 'user alredy exisy'}, {status : 400})
        }else{
            console.log("no farmer")
        }
        // const salt = await bycrypt.genSalt(10);
        // const hashedpass = await bycrypt.hash( password , salt);

        const newstd = new studentmodel({
             aadhaarNumber: aadhaar,
             fullName:fullName,
              mobileNumber:mobile,
              email: email,
              state: state,
              district: district,
              educationalInstitution: institution,
              educationLevel: educationLevel,
              disability: disability,
              role: "Student",
              password : password 
            

        })
        const savedstd = await newstd.save()
        

        return NextResponse.json({
            message : "new std saves"
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({error : error});
    }



}
