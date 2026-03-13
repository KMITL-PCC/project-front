import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. 🔥 เติมคำว่า async ข้างหน้าฟังก์ชัน
export async function proxy(request: NextRequest) {
    try {
        // 2. 🔥 ดึง Cookie จาก Request เดิมมาด้วย ไม่งั้น API ฝั่ง Backend จะมองว่าไม่ได้ล็อกอิน
        const cookieHeader = request.headers.get('cookie') || '';

        // 3. 🔥 ต้องใส่ origin (URL เต็ม) เข้าไปด้วย เพราะ Middleware ไม่รู้จัก Relative Path ("/")
        const res = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Cookie': cookieHeader
            }
        });

        if (!res.ok) throw new Error("Failed to get user");

        const data = await res.json();

        // 4. 🔥 เช็ค Role ตามโจทย์
        const userRole = data.user?.role?.name || data.user?.role;

        if (userRole === "admin") {
            // ถ้าเป็น Admin ให้เตะไป /dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

    } catch (error) {
        console.error("Proxy Auth Error:", error);
    }

    // 5. 🔥 ถ้าไม่ใช่ Admin หรือมี Error อะไรก็ตาม ให้ "ปล่อยผ่าน" ไปยังหน้าที่ขอเข้ามา
    return NextResponse.next();
}

// 6. 🔥 Config ต้องอยู่นอกสุดเสมอ (ห้ามไปอยู่ในปีกกาของฟังก์ชัน)
export const config = {
    matcher: [
        /*
         * สั่งให้ Middleware ดักจับ "ทุกหน้า" ที่วิ่งเข้ามา
         * ยกเว้น (?!...) สิ่งเหล่านี้:
         * 1. api       -> ไม่ต้องดัก API Routes ฝั่ง Backend
         * 2. _next/static -> ไม่ต้องดักไฟล์ระบบ/CSS/JS ของ Next.js
         * 3. _next/image  -> ไม่ต้องดักรูปภาพ (Image Optimization)
         * 4. favicon.ico  -> ไม่ต้องดักไอคอนบนแท็บเบราว์เซอร์
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
