import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const authRoutes = ['/login', '/signup', '/verifyemail', '/forgotpassword'];
const protectedPrefixes = ['/dashboard'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isAuthRoute = authRoutes.includes(pathname);
    const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
    ]
};