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

    // Find user by email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const userId = user._id

    const postId = params.id
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }

    const post = await Post.findById(postId)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const comment = {
      user: userId,
      content: content.trim(),
      createdAt: new Date()
    }

    post.comments.push(comment)
    await post.save()

    // Populate the comment with user data
    await post.populate('comments.user', 'username name avatar verified')

    const newComment = post.comments[post.comments.length - 1]

    return NextResponse.json({ 
      success: true, 
      comment: newComment 
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
