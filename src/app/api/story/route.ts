import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing required field: user_id' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all stories for the user with their chapters
    const stories = await prisma.story.findMany({
      where: {
        authorId: user_id,
      },
      include: {
        chapters: {
          select: {
            order: true,
          },
          orderBy: {
            order: 'asc',
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    // Format the response according to the schema
    const formattedStories = stories.map(story => ({
      story_id: story.id,
      title: story.title,
      chapter_numbers: story.chapters.map(chapter => chapter.order),
    }));

    return NextResponse.json({
      stories: formattedStories,
    });
  } catch (error) {
    console.error('Get stories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 