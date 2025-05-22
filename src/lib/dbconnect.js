import mongoose from "mongoose";

export async function connect(){

try{
    mongoose.connect(process.env.MONGODB_URI)
    const connection = mongoose.connection;

    connection.on("connected", ()=>{
        console.log("mongoose connected")

    })
    connection.on("error", (err)=>{
        console.log("mongoose connection error")
        console.log(err)
        process.exit()
    })
}
catch(error){
    console.log('something whent wrong in the connection mb')
    console.log(error)
}
}