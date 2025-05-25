import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { externalApiService } from '@/lib/externalApi';

export async function POST(request: NextRequest) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { genre, custom_prompt } = await request.json();

    if (!genre) {
      return NextResponse.json(
        { error: 'Missing required field: genre' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate story using external API
    const externalResult = await externalApiService.generateStory({
      user_id: user.id,
      genre,
      custom_prompt
    });

    if (!externalResult.success) {
      // Fallback to local generation if external API fails
      console.warn('External API failed, using fallback:', externalResult.error);
      
      const story = await prisma.story.create({
        data: {
          title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Adventure`,
          description: custom_prompt || `A ${genre} story`,
          authorId: user.id,
          tags: [genre],
          isPublic: false,
        }
      });

      const chapter = await prisma.chapter.create({
        data: {
          storyId: story.id,
          order: 1,
          content: `Welcome to your ${genre} adventure! ${custom_prompt ? `Your prompt: ${custom_prompt}` : 'The story begins...'}`,
          choices: ['Continue the adventure', 'Explore a different path'],
          isGenerated: false,
          promptUsed: custom_prompt || `Generate a ${genre} story`,
        }
      });

      return NextResponse.json({
        story_id: story.id,
        title: story.title,
        genre: genre,
        chapters: [{
          chapter_num: chapter.order,
          content: chapter.content,
          choices: chapter.choices as string[]
        }],
        current_chapter: chapter.order,
        source: 'local'
      });
    }

    // Store the externally generated story in local database
    const externalStory = externalResult.data;
    
    const story = await prisma.story.create({
      data: {
        title: externalStory.title || `${genre.charAt(0).toUpperCase() + genre.slice(1)} Adventure`,
        description: `${custom_prompt || `A ${genre} story`} [external_id:${externalStory.story_id}]`,
        authorId: user.id,
        tags: [genre],
        isPublic: false,
      }
    });

    // Store all chapters from external API
    const chapters = [];
    for (const externalChapter of externalStory.chapters) {
      const chapter = await prisma.chapter.create({
        data: {
          storyId: story.id,
          order: externalChapter.chapter_num,
          content: externalChapter.content,
          choices: externalChapter.choices,
          isGenerated: true,
          promptUsed: custom_prompt || `Generate a ${genre} story`,
        }
      });
      chapters.push({
        chapter_num: chapter.order,
        content: chapter.content,
        choices: chapter.choices as string[]
      });
    }

    return NextResponse.json({
      story_id: story.id,
      title: story.title,
      genre: genre,
      chapters: chapters,
      current_chapter: externalStory.current_chapter,
      external_story_id: externalStory.story_id,
      source: 'external'
    });
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 