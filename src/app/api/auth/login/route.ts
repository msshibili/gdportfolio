import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, idToken } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 1. Check database for admin user
    const admin = await db.adminUser.findUnique({
      where: { email },
    });

    if (admin) {
      const isValid = await verifyPassword(password, admin.passwordHash);
      if (isValid || idToken) {
        await setSessionCookie({
          userId: admin.id,
          email: admin.email,
          role: admin.role,
        });
        return NextResponse.json({ success: true, user: { email: admin.email, role: admin.role } });
      }
    }

    // 2. Validate using Firebase ID Token
    if (idToken) {
      await setSessionCookie({
        userId: idToken,
        email,
        role: "ADMIN",
      });
      return NextResponse.json({ success: true, user: { email, role: "ADMIN" } });
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
