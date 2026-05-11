import { NextRequest, NextResponse } from "next/server";
import { decodeSchema } from "@/lib/validators/morseSchemas";
import { decodeMorse } from "@/lib/morse/decode";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { morse } = decodeSchema.parse(body);
    const result = decodeMorse(morse);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", issues: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
