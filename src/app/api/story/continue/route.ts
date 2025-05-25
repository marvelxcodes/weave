import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { user_id, story_id, choice } = await request.json();

    if (!user_id || !story_id || choice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, story_id, and choice' },
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

    // Verify story exists and belongs to user
    const story = await prisma.story.findFirst({
      where: {
        id: story_id,
        authorId: user_id,
      },
      include: {
        chapters: {
          orderBy: { order: 'desc' },
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

    const lastChapter = story.chapters[0];
    const nextChapterOrder = lastChapter ? lastChapter.order + 1 : 1;

    // Get the choice text from the previous chapter
    const choices = lastChapter?.choices as string[] || [];
    const selectedChoice = choices[choice] || 'Continue';

    // Create the next chapter
    const newChapter = await prisma.chapter.create({
      data: {
        storyId: story_id,
        order: nextChapterOrder,
        content: `Continuing from your choice: "${selectedChoice}". The story unfolds further...`,
        choices: ['Take the left path', 'Take the right path'],
        isGenerated: true,
        promptUsed: `Continue story based on choice: ${selectedChoice}`,
      }
    });

    return NextResponse.json({
      story_id: story_id,
      chapter_x: newChapter.order,
      choices_in_title: newChapter.choices as string[],
      content: newChapter.content,
    });
  } catch (error) {
    console.error('Story continuation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 