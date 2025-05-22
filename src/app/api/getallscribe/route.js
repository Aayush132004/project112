
import { NextResponse } from "next/server";
import Scribemodel from "../../../models/scribe";

export async function POST(request) {
  try {
    const scribes = await Scribemodel.find({}, '-password');
    //console.log(scribes)
    
    if(scribes) {
      
      return NextResponse.json(scribes);
    } else {
      return NextResponse.json("not available");
    }
  } catch (error) {
    console.error("Error fetching scribes:", error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}