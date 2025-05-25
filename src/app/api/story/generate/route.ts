import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { user_id, genre, custom_prompt } = await request.json();

    if (!user_id || !genre) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id and genre' },
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

    // Create a new story
    const story = await prisma.story.create({
      data: {
        title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Adventure`,
        description: custom_prompt || `A ${genre} story`,
        authorId: user_id,
        tags: [genre],
        isPublic: false,
      }
    });

    // Create the first chapter
    const chapter = await prisma.chapter.create({
      data: {
        storyId: story.id,
        order: 1,
        content: `Welcome to your ${genre} adventure! ${custom_prompt ? `Your prompt: ${custom_prompt}` : ''}`,
        choices: ['Continue the adventure', 'Explore a different path'],
        isGenerated: true,
        promptUsed: custom_prompt || `Generate a ${genre} story`,
      }
    });

    return NextResponse.json({
      story_id: story.id,
      chapter_x: chapter.order,
      choices_in_title_for_story: chapter.choices as string[],
      content: chapter.content,
    });
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 