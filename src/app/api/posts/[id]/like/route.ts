import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import connectDB from '../../../../../lib/mongodb'
import { Post } from '../../../../../models/Post'
import { User } from '../../../../../models/User'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const postId = params.id
    // Find user by email since that's what we have in session
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const userId = user._id

    const post = await Post.findById(postId)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const isLiked = post.likes.includes(userId)

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id: string) => id.toString() !== userId)
    } else {
      // Like the post
      post.likes.push(userId)
    }

    await post.save()

    return NextResponse.json({ 
      success: true, 
      liked: !isLiked,
      likesCount: post.likes.length 
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
