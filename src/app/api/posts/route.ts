import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Post } from '../../../models/Post'
import { User } from '../../../models/User'
import connectDB from '../../../lib/mongodb'
import { authOptions } from '../../../lib/auth'

// GET - Fetch posts for feed
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'explore'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    let posts

    if (session?.user?.id) {
      const currentUserId = session.user.id
      
      if (filter === 'following') {
        // Get posts from users the current user follows
        const currentUser = await User.findById(currentUserId)
        const followingIds = currentUser?.following || []
        
        posts = await Post.find({
          $or: [
            { author: { $in: followingIds } },
            { author: currentUserId } // Include user's own posts
          ],
          visibility: { $in: ['public', 'followers'] }
        })
        .populate({
          path: 'author',
          select: 'name username avatar verified honorPoints level stats profile'
        })
        .populate({
          path: 'comments.user',
          select: 'name username avatar verified'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
      } else {
        // Explore - get all public posts
        posts = await Post.find({
          visibility: 'public'
        })
        .populate({
          path: 'author',
          select: 'name username avatar verified honorPoints level stats profile'
        })
        .populate({
          path: 'comments.user',
          select: 'name username avatar verified'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
      }
    } else {
      // Public posts only for non-authenticated users
      posts = await Post.find({ visibility: 'public' })
      .populate({
        path: 'author',
        select: 'name username avatar verified honorPoints level stats profile'
      })
      .populate({
        path: 'comments.user',
        select: 'name username avatar verified'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    }

    return NextResponse.json({ posts, hasMore: posts.length === limit })
  } catch (error) {
    console.error('Posts fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, images, type, tags, visibility, metadata } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Determine achievement type from content if it's an achievement post
    let achievementType = 'default'
    if (type === 'achievement') {
      const contentLower = content.toLowerCase()
      if (contentLower.includes('streak')) achievementType = 'streak'
      else if (contentLower.includes('milestone')) achievementType = 'milestone'
      else if (contentLower.includes('meditation')) achievementType = 'meditation'
      else if (contentLower.includes('exercise') || contentLower.includes('workout')) achievementType = 'exercise'
      else if (contentLower.includes('reading') || contentLower.includes('book')) achievementType = 'reading'
      else if (contentLower.includes('learning') || contentLower.includes('course')) achievementType = 'learning'
    }

    const post = new Post({
      author: session.user.id,
      content: content.trim(),
      images: images || [],
      type: type || 'text',
      tags: tags || [],
      visibility: visibility || 'public',
      metadata: {
        ...metadata,
        achievementType: type === 'achievement' ? achievementType : undefined
      }
    })

    await post.save()

    // Update user's post count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { 'stats.postsCount': 1 }
    })

    // Populate the post data
    await post.populate({
      path: 'author',
      select: 'name username avatar verified honorPoints level stats profile'
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
