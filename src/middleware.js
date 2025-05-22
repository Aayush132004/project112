import { NextResponse ,NextRequest} from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {

 const path = request.nextUrl.pathname
 const publicpath = path === '/studentlogin' || path === '/studentsignup' || path === '/scribelogin' || path === '/scribesignup' || path==='/' 

 const token = request.cookies.get('studenttoken')?.value || request.cookies.get('scribetoken')?.value  || ''
//  if(publicpath && token){
//     return NextResponse.redirect(new URL('/profile', request.nextUrl))
//  }
 
 if(!publicpath && !token){
    return NextResponse.redirect(new URL('/' , request.nextUrl))
 }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/studentdashboard',
    '/scribedashboard',
    '/studentsignup',
    '/scribesignup',
    '/studentlogin',
    '/scribelogin'
  ],
}