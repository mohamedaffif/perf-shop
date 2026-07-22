import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError } from "@/lib/api-error";

const subscribeSchema = z.object({
  email: z.email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    console.log(`Newsletter signup: ${email}`);

    return NextResponse.json({ subscribed: true });
  } catch (error) {
    return handleApiError(error);
  }
}
