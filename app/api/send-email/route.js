import { NextResponse } from "next/server";
import { Resend } from "resend";
import Email from "@/emails"; // Make sure this is the correct component path

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, name, orderItems } = await req.json();

    if (!email || !name || !orderItems || !Array.isArray(orderItems)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields." },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: "CravingCart <onboarding@resend.dev>",
      to: [email],
      subject: "🧾 Your Craving Cart Order Confirmation",
      react: Email({ name, orderItems }), // Email component should handle rendering
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
