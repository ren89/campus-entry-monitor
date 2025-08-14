import { NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/services/twilioService";

export async function POST(request: Request) {
  try {
    const { to, body } = await request.json();
    if (!to || !body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const result = await sendWhatsApp(to, body);
    return NextResponse.json({ success: true, sid: result.sid });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send WhatsApp message" },
      { status: 500 }
    );
  }
}
