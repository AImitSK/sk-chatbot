import { client } from "@/sanity/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Hole alle Konversationen aus Sanity
    const conversations = await client.fetch(`*[_type == "conversation"]`);
    
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Fehler beim Abrufen der Konversationen:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Konversationen" },
      { status: 500 }
    );
  }
}
