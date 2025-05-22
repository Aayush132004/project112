import jwt from "jsonwebtoken";

export async function Getdatafrmtsc(request) {
    try {
        const token = await request.cookies.get("scribetoken")?.value ||'';
        console.log(token ,"token");
        const decodedtoken = await jwt.verify(token , process.env.TOKEN_SECRET);
        console.log(decodedtoken.id , "decoded token");
        
        return decodedtoken.id;
    } catch (error) {
        throw new   Error(error.message);
    }
}