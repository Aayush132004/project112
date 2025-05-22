
import { Getdatafrmts } from "../../../../helper/getdatastudent";

import { connect } from "../../../../lib/dbconnect";
import studentmodel from '../../../../models/student'
import { NextResponse } from "next/server";
connect()

export async function POST(request) {
    try {
        const stdid = await Getdatafrmts(request);
        console.log(stdid , "stdid");
        if(stdid != null){
        const std = await studentmodel.findById(stdid);
        console.log(std , "get student route  ");
         return NextResponse.json({
            message : "user found",
            data : std
         })
        }
        else{
        return NextResponse.json({message : "please login"})
        }
        

    
    } catch (error) {
        console.error(error);
    return NextResponse.json({
      message: "Error occurred",
      error: error.message
    }, { status: 500 });
    }
}