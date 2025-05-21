import fs from 'fs/promises';
import path from 'path';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const leaderboardPath = path.join(process.cwd(), 'src/app/api/interview/leader-board/leaders.json');
    const data = await fs.readFile(leaderboardPath, 'utf-8');
    const leaders = JSON.parse(data);
    
    return Response.json(leaders);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return Response.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
