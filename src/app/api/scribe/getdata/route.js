


import { Getdatafrmtsc } from "../../../../helper/getdatascribe";
import { connect } from "../../../../lib/dbconnect";
import scribemodel from '../../../../models/scribe'
import { NextResponse } from "next/server";
connect()

export async function POST(request) {
    try {
        const scbid = await Getdatafrmtsc(request);
        console.log(scbid , "stdid");
        if(scbid != null){
        const scb = await scribemodel.findById(scbid);
        console.log(scb , "get student route  ");
         return NextResponse.json({
            message : "user found",
            data : scb
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