import { connect } from "../../../../lib/dbconnect";
import { NextResponse } from "next/server";
import scribemodel from "../../../../models/scribe";


connect();

export async function POST(request) {
  try {
    // Parse request body
    const reqbody = await request.json();
    console.log(reqbody);
    const { availableDates, userId } = reqbody;
    console.log(availableDates);
    
    if (!userId || !Array.isArray(availableDates)) {
      return NextResponse.json({ success: false, message: 'Invalid request data' }, { status: 400 });
    }
    
    const parsedDates = availableDates.map(date => new Date(date));
    
    // First, fetch the current scribe to check existing dates
    const currentScribe = await scribemodel.findById(userId);
    if (!currentScribe) {
      return NextResponse.json({ success: false, message: 'Scribe not found' }, { status: 404 });
    }
    
    // Create a map of dates to toggle
    const datesToToggle = new Map();
    
    // Format existing dates to string format for comparison
    const existingDatesStrings = currentScribe.availableDates.map(date => 
      date.toISOString().split('T')[0]
    );
    
    // Check which dates should be removed vs added
    for (const newDate of parsedDates) {
      const newDateString = newDate.toISOString().split('T')[0];
      const alreadyExists = existingDatesStrings.includes(newDateString);
      
      if (alreadyExists) {
        // If date already exists, we'll remove it
        datesToToggle.set(newDateString, 'remove');
      } else {
        // If date doesn't exist, we'll add it
        datesToToggle.set(newDateString, 'add');
      }
    }
    
    // Prepare the final date array
    const finalDates = currentScribe.availableDates.filter(date => {
      const dateString = date.toISOString().split('T')[0];
      return datesToToggle.get(dateString) !== 'remove';
    });
    
    // Add the new dates
    parsedDates.forEach(date => {
      const dateString = date.toISOString().split('T')[0];
      if (datesToToggle.get(dateString) === 'add') {
        finalDates.push(date);
      }
    });
    
    // Update the scribe with the new date array
    const updatedScribe = await scribemodel.findByIdAndUpdate(
      userId,
      { availableDates: finalDates },
      { new: true }
    );
    
    return NextResponse.json({ success: true, data: updatedScribe }, { status: 200 });
  } catch (error) {
    console.error("Update Dates Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
