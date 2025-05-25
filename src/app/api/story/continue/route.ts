import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
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

    const { story_id, choice } = await request.json();

    console.log('Continue story request:', { story_id, choice, type_story_id: typeof story_id, type_choice: typeof choice });

    if (!story_id || choice === undefined) {
      console.error('Missing required fields:', { 
        story_id_missing: !story_id, 
        choice_missing: choice === undefined,
        story_id_value: story_id,
        choice_value: choice 
      });
      return NextResponse.json(
        { error: 'Missing required fields: story_id and choice' },
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

    // Verify story exists and belongs to user
    const story = await prisma.story.findFirst({
      where: {
        id: story_id,
        authorId: user.id,
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

    // Get the choice in A/B format for external API
    let selectedChoice: string;
    let choiceForExternal: string;
    
    if (typeof choice === 'number') {
      const choices = lastChapter?.choices as string[] || [];
      selectedChoice = choices[choice] || 'Continue';
      choiceForExternal = choice === 0 ? 'A' : 'B';
    } else if (choice === 'A' || choice === 'B') {
      // Already in A/B format
      choiceForExternal = choice;
      selectedChoice = choice;
    } else {
      // Full text choice - try to determine if it's first or second choice
      const choices = lastChapter?.choices as string[] || [];
      const choiceIndex = choices.indexOf(choice);
      choiceForExternal = choiceIndex === 0 ? 'A' : 'B';
      selectedChoice = choice;
    }

    // Try to continue story using external API
    // We need to find the external story ID if it exists
    const externalStoryId = await getExternalStoryId(story_id);
    
    if (externalStoryId) {
      const externalResult = await externalApiService.continueStory({
        user_id: user.id,
        story_id: externalStoryId,
        choice: choiceForExternal // Send "A" or "B" to external API
      });

      if (externalResult.success) {
        // Store the new chapter from external API
        const externalChapter = externalResult.data;
        
        const newChapter = await prisma.chapter.create({
          data: {
            storyId: story_id,
            order: nextChapterOrder,
            content: externalChapter.content,
            choices: externalChapter.choices,
            isGenerated: true,
            promptUsed: `Continue story based on choice: ${selectedChoice}`,
          }
        });

        return NextResponse.json({
          chapter_num: newChapter.order,
          content: newChapter.content,
          choices: newChapter.choices as string[],
          source: 'external'
        });
      }
    }

    // Fallback to local generation if external API fails or no external story ID
    console.warn('Using local fallback for story continuation');
    
    const newChapter = await prisma.chapter.create({
      data: {
        storyId: story_id,
        order: nextChapterOrder,
        content: `Continuing from your choice: "${selectedChoice}". The story unfolds further...`,
        choices: ['Take the left path', 'Take the right path'],
        isGenerated: false,
        promptUsed: `Continue story based on choice: ${selectedChoice}`,
      }
    });

    return NextResponse.json({
      chapter_num: newChapter.order,
      content: newChapter.content,
      choices: newChapter.choices as string[],
      source: 'local'
    });
  } catch (error) {
    console.error('Story continuation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get external story ID
// This could be stored in the story metadata or a separate table
async function getExternalStoryId(localStoryId: string): Promise<number | null> {
  try {
    // For now, we'll try to extract it from the story description or use a simple mapping
    // In a production app, you'd want to store this relationship properly
    const story = await prisma.story.findUnique({
      where: { id: localStoryId },
      select: { description: true }
    });
    
    // This is a simple approach - in production you'd want a proper mapping table
    if (story?.description?.includes('external_id:')) {
      const match = story.description.match(/external_id:(\d+)/);
      return match ? parseInt(match[1]) : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting external story ID:', error);
    return null;
  }
} 