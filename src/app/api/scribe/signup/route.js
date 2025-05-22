// import { connect } from "../../../../lib/dbconnect"
// import { NextResponse } from "next/server";
// import scribemodel from '../../../../models/scribe'
// import bycrypt from "bcryptjs"
// connect()
// export async function POST(request) {
//     try {
//         const reqbody =  await request.json();
//         console.log(reqbody , "hi");
//         const {
//             aadhaar,
//             fullName,
//             mobile,
//             email,
//             state,
//             district,
//             qualification,
//             institute,
//             subjects,
//             password,
//              confirmPassword  

//           } = reqbody;
//     //     const { name , phone  , email, city ,password } = reqbody;
//        console.log(aadhaar , "aadhar");


//         const  std = await scribemodel.findOne({aadhaarNumber : aadhaar});
//         if(std){
//             console.log("std already present" , std)
//             return NextResponse.json({error : 'user alredy exisy'}, {status : 400})
//         }else{
//             console.log("no farmer")
//         }
//         // const salt = await bycrypt.genSalt(10);
//         // const hashedpass = await bycrypt.hash( password , salt);

//         const newstd = new scribemodel({
//             aadhaarNumber : aadhaar,
//               fullName: fullName,
//               mobileNumber: mobile ,
//               email: email,
//               state: state,
//               district: district,
//               highestQualification: qualification  ,
//               institute: institute,
//               subjectsOfExpertise:subjects,
//               role: "Scribe",
             
//               password :password
            

//         })
//         const savedstd = await newstd.save()
        

//         return NextResponse.json({
//             message : "new std saves"
//         });

//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({error : error});
//     }
// }

// import { NextResponse } from 'next/server';
// import { connect } from '../../../../lib/dbconnect';
// import scribemodel from '../../../../models/scribe';
// import bcrypt from 'bcryptjs';
// import supabase from '../../../../lib/supabase';
// import formidable from 'formidable';
// import fs from 'fs/promises';
// import axios from 'axios';

// // export const config = {
// //   api: {
// //     bodyParser: false
// //   }
// // };

// export async function POST(req) {
//   try {
//     await connect();

//     const form = formidable({ multiples: false });
//     const { fields, files } = await new Promise((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     });

//     const {
//       aadhaar,
//       fullName,
//       mobile,
//       email,
//       state,
//       district,
//       qualification,
//       institute,
//       subjects,
//       password
//     } = fields;

//     const existing = await scribemodel.findOne({ aadhaarNumber: aadhaar });
//     if (existing) {
//       return NextResponse.json({ error: 'Scribe already exists' }, { status: 400 });
//     }

//     const pdfFile = files.pdf;
//     const pdfBuffer = await fs.readFile(pdfFile.filepath);

//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from('scribes')
//       .upload(`qualifications/${Date.now()}-${pdfFile.originalFilename}`, pdfBuffer, {
//         contentType: 'application/pdf'
//       });

//     if (uploadError) {
//       console.error(uploadError);
//       return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
//     }

//     const pdfUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/scribes/${uploadData.path}`;
//     // const hashedPass = await bcrypt.hash(password, 10);

//     const scribe = new scribemodel({
//       aadhaarNumber: aadhaar,
//       fullName,
//       mobileNumber: mobile,
//       email,
//       state,
//       district,
//       highestQualification: Number(qualification),
//       institute,
//       role: "Scribe",
//       password: password,
//       qualificationPdfLink: pdfUrl,
//       subjectsOfExpertise: JSON.parse(subjects),
//       availableDates: []
//     });

//     await scribe.save();

//     return NextResponse.json({ message: 'Scribe registered successfully' });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

import { connect } from "../../../../lib/dbconnect";
import { NextResponse } from "next/server";
import scribemodel from "../../../../models/scribe";
import bcrypt from "bcryptjs";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { url , formData } = reqBody;
    console.log(url)
    console.log(reqBody , "reqbdy")
    const {
      aadhaar,
      fullName,
      mobile,
      email,
      state,
      district,
      qualification,
      institute,
      subjects,
      password,
      
    } = formData;

    const existing = await scribemodel.findOne({ aadhaarNumber: aadhaar });
    if (existing) {
      return NextResponse.json({ error: "Scribe already exists" }, { status: 400 });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newScribe = new scribemodel({
      aadhaarNumber: aadhaar,
      fullName : fullName,
      mobileNumber: mobile,
      email : email,
      state : state,
      district : district,
      highestQualification: qualification,
      institute : institute,
      // subjectsOfExpertise: subjects.split(',').map(s => s.trim()),
    
      role: "Scribe",
      password: password,
      qualificationPdfLink: url
    });

    

    await newScribe.save();
 

    return NextResponse.json({ message: "Scribe registered" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
