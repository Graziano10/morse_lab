import { NextRequest, NextResponse } from "next/server";
import { encodeSchema } from "@/lib/validators/morseSchemas";
import { encodeText } from "@/lib/morse/encode";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { text } = encodeSchema.parse(body);
    const result = encodeText(text);

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
