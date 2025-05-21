import type { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Leader {
  id: number;
  rank: number;
  name: string;
  averageScore: number;
  totalInterviews: number;
  difficulty: string;
}

interface Candidate {
  name: string;
  difficulty: string;
}

// Pool of potential new candidates
const candidatePool: Candidate[] = [
  { name: "Sophie", difficulty: "beginner" },
  { name: "James", difficulty: "intermediate" },
  { name: "Emma", difficulty: "beginner" },
  { name: "Oliver", difficulty: "intermediate" },
  { name: "Ava", difficulty: "beginner" },
  { name: "Noah", difficulty: "intermediate" },
  { name: "Isabella", difficulty: "beginner" },
  { name: "William", difficulty: "intermediate" },
  { name: "Sophia", difficulty: "beginner" },
  { name: "Benjamin", difficulty: "intermediate" }
];

function getNewCandidate(currentLeaders: Leader[]): Leader {
  // Find a random candidate that's not currently in the leaderboard
  let candidate: Candidate;
  do {
    candidate = candidatePool[Math.floor(Math.random() * candidatePool.length)];
  } while (currentLeaders.some(leader => leader.name === candidate.name));

  // Generate realistic starting stats
  const averageScore = 70 + Math.random() * 10; // New candidates start with 70-80 score
  const totalInterviews = 5 + Math.floor(Math.random() * 5); // Start with 5-9 interviews

  return {
    id: Math.max(...currentLeaders.map(l => l.id)) + 1, // Generate new unique ID
    rank: 0, // Will be calculated later
    name: candidate.name,
    averageScore: Number(averageScore.toFixed(1)),
    totalInterviews,
    difficulty: candidate.difficulty
  };
}

async function updateLeaderboard() {
  const leaderboardPath = path.join(process.cwd(), 'src/app/api/interview/leader-board/leaders.json');
  const data = await fs.readFile(leaderboardPath, 'utf-8');
  let leaders: Leader[] = JSON.parse(data);

  // Possibly replace bottom 2 positions (20% chance for each)
  const bottomTwo = leaders.slice(-2);
  bottomTwo.forEach((leader, index) => {
    if (Math.random() < 0.2) { // 20% chance to replace each bottom position
      const newCandidate = getNewCandidate(leaders);
      leaders[leaders.length - (2 - index)] = newCandidate;
    }
  });

  // Update scores based on position
  leaders = leaders.map((leader, index) => {
    let volatility: number;
    if (index < 3) {
      // Top 3: Very small changes
      volatility = 0.5;
    } else if (index < 5) {
      // Middle ranks: Moderate changes
      volatility = 2;
    } else {
      // Lower ranks: Large changes
      volatility = 4;
    }

    const change = (Math.random() - 0.5) * volatility;
    const newScore = Math.max(60, Math.min(100, leader.averageScore + change));
    
    return {
      ...leader,
      averageScore: Number(newScore.toFixed(1)),
      totalInterviews: leader.totalInterviews + Math.floor(Math.random() * 2) // Occasionally increment interviews
    };
  });

  // Sort by score and update ranks
  leaders.sort((a, b) => b.averageScore - a.averageScore);
  leaders = leaders.map((leader, index) => ({
    ...leader,
    rank: index + 1
  }));

  // Save updated data
  await fs.writeFile(leaderboardPath, JSON.stringify(leaders, null, 2));
  return leaders;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  /*if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }*/

  try {
    const updatedLeaders = await updateLeaderboard();
    return Response.json({ success: true, leaders: updatedLeaders });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return Response.json({ success: false, error: 'Failed to update leaderboard' }, { status: 500 });
  }
}