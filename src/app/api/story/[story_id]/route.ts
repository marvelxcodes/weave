import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { story_id: string } }
) {
  try {
    const { user_id, chapter_num } = await request.json();
    const { story_id } = params;

    if (!user_id || !chapter_num) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id and chapter_num' },
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

    // Get the story and specific chapter
    const story = await prisma.story.findFirst({
      where: {
        id: story_id,
        authorId: user_id,
      },
      include: {
        chapters: {
          where: {
            order: chapter_num,
          },
          take: 1,
        }
      }
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found or access denied' },
        { status: 404 }
      );
    }

    const chapter = story.chapters[0];
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      current_chapter_number: chapter.order,
      story_itself: chapter.content,
    });
  } catch (error) {
    console.error('Get story details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 