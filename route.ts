import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'xp'
    const limit = parseInt(searchParams.get('limit') || '20')

    let orderBy = {}
    
    switch (type) {
      case 'xp':
        orderBy = { totalXp: 'desc' }
        break
      case 'streak':
        orderBy = { streak: 'desc' }
        break
      case 'lessons':
        orderBy = { completedLessons: { _count: 'desc' } }
        break
      default:
        orderBy = { totalXp: 'desc' }
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        totalXp: true,
        streak: true,
        currentStage: true,
        currentSubStage: true,
        _count: {
          select: {
            completedLessons: true
          }
        }
      },
      orderBy,
      take: limit
    })

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        image: true,
        totalXp: true,
        streak: true,
        currentStage: true,
        currentSubStage: true,
        _count: {
          select: {
            completedLessons: true
          }
        }
      }
    })

    let currentUserRank = 0
    if (currentUser) {
      const higherRankedCount = await prisma.user.count({
        where: type === 'xp' ? { totalXp: { gt: currentUser.totalXp } } :
               type === 'streak' ? { streak: { gt: currentUser.streak } } :
               { completedLessons: { some: {} } }
      })
      currentUserRank = higherRankedCount + 1
    }

    const leaderboard = users.map((user: any, index: number) => ({
      ...user,
      rank: index + 1,
      completedLessons: user._count.completedLessons
    }))

    return NextResponse.json({
      leaderboard,
      currentUser: currentUser ? {
        ...currentUser,
        rank: currentUserRank,
        completedLessons: currentUser._count.completedLessons
      } : null,
      type
    })

  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
