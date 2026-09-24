import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, projectType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Contact Inquiry Received:", { name, email, projectType, message });

    return NextResponse.json({ success: true, message: "Inquiry logged successfully" });
  } catch {
    return NextResponse.json({ error: "Server error handling contact submission" }, { status: 500 });
  }
}
