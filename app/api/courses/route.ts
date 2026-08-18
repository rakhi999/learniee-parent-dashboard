import { NextRequest, NextResponse } from "next/server";
import { searchCourses } from "@/lib/course-search";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await searchCourses(request.nextUrl.searchParams);
  return NextResponse.json(result, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
