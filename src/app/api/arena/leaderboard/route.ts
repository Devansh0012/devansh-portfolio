import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/leaderboard";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get("challengeId") ?? undefined;
  const leaderboard = getLeaderboard(challengeId);
  return NextResponse.json({ leaderboard });
}
