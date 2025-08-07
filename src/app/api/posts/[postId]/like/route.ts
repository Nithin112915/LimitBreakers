import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Post } from '../../../../../models/Post'
import connectDB from '../../../../../lib/mongodb'
import { authOptions } from '../../../../../lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = params
    const userId = session.user.id

    const post = await Post.findById(postId)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const isLiked = post.likes.includes(userId)

    if (isLiked) {
      // Unlike the post
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId }
      })
      
      return NextResponse.json({ 
        success: true, 
        liked: false,
        likesCount: post.likes.length - 1
      })
    } else {
      // Like the post
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId }
      })
      
      return NextResponse.json({ 
        success: true, 
        liked: true,
        likesCount: post.likes.length + 1
      })
    }
  } catch (error) {
    console.error('Like/unlike error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
