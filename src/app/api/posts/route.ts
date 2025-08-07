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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    let posts

    if (session?.user?.id) {
      // Get current user's following list
      const currentUser = await User.findById(session.user.id)
      const following = currentUser?.following || []
      
      // Get posts from followed users + own posts
      posts = await Post.find({
        $or: [
          { author: { $in: [...following, session.user.id] } },
          { visibility: 'public' }
        ]
      })
    } else {
      // Public posts only for non-authenticated users
      posts = await Post.find({ visibility: 'public' })
    }

    posts = await posts
      .populate('author', 'username name avatar honorPoints level')
      .populate('likes', 'username name avatar')
      .populate('comments.user', 'username name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

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

    const post = new Post({
      author: session.user.id,
      content: content.trim(),
      images: images || [],
      type: type || 'text',
      tags: tags || [],
      visibility: visibility || 'public',
      metadata: metadata || {}
    })

    await post.save()

    // Update user's post count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { 'stats.postsCount': 1 }
    })

    // Populate the post data
    await post.populate('author', 'username name avatar honorPoints level')

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
