import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    function getCurrentUser() {

        try {
            const res = await fetch("/api/auth/me", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to get user");

            const data = await res.json();
        }

  return NextResponse.redirect(new URL('/home', request.url))
    }

    // Alternatively, you can use a default export:
    // export default function proxy(request: NextRequest) { ... }

    export const config = {
        matcher: '/about/:path*',
    }