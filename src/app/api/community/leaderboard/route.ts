import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Mark as dynamic route

export async function GET(request: NextRequest) {
  try {
    // Mock leaderboard data for demo - avoiding database/auth calls during static generation
    const leaderboard = [
      {
        _id: '1',
        name: 'Sarah Chen',
        honorPoints: 3200,
        level: 7,
        streak: 45,
        completedHabits: 156
      },
      {
        _id: '2', 
        name: 'Mike Johnson',
        honorPoints: 2800,
        level: 6,
        streak: 32,
        completedHabits: 134
      },
      {
        _id: '3',
        name: 'Lisa Wang', 
        honorPoints: 2100,
        level: 5,
        streak: 28,
        completedHabits: 98
      },
      {
        _id: '4',
        name: 'Alex Smith',
        honorPoints: 1950,
        level: 4,
        streak: 22,
        completedHabits: 87
      },
      {
        _id: '5',
        name: 'Emma Davis',
        honorPoints: 1750,
        level: 4,
        streak: 19,
        completedHabits: 76
      }
    ]

    // Format leaderboard data
    const formattedLeaderboard = leaderboard.map((user, index) => ({
      position: index + 1,
      id: user._id,
      name: user.name,
      honorPoints: user.honorPoints,
      level: user.level,
      currentStreak: user.streak,
      completedHabits: user.completedHabits,
      isCurrentUser: false
    }))

    return NextResponse.json({
      leaderboard: formattedLeaderboard,
      currentUser: {
        position: 3,
        name: 'Demo User',
        honorPoints: 2450,
        level: 5,
        currentStreak: 12,
        completedHabits: 87
      },
      type: 'honor_points',
      total: leaderboard.length
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
