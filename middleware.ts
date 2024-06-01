import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export default function middleware(request: NextRequest) {
    // const sessionToken = request.cookies.get('sessionToken')
    // console.log(sessionToken);

    // if (!sessionToken) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }

    // if (request.nextUrl.pathname.startsWith('/teacher') && !sessionToken) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }
    // if (request.nextUrl.pathname.startsWith('/course/learning')) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }
}

