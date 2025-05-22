import {NextResponse } from 'next/server'
export async function POST(request){

try {
    const response = NextResponse.json({
        message : "Logout succesfull",
        sucess : true
    })
    response.cookies.set('studenttoken', '',{
        httpOnly : true,
        expires : new Date(0)
    } )
    response.cookies.set('scribetoken', '',{
        httpOnly : true,
        expires : new Date(0)
    } )

    return response
} catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    
}

}