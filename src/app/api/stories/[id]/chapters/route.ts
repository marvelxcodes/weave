import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Add new chapter to story
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { choice } = await request.json();
    const { id: storyId } = await params;

    if (!choice) {
      return NextResponse.json(
        { error: 'Choice is required' },
        { status: 400 }
      );
    }

    // Check if user owns the story
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        chapters: {
          orderBy: { order: 'desc' },
          take: 1
        }
      }
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    
    if (story.authorId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to add chapters to this story' },
        { status: 403 }
      );
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    const nextOrder = story.chapters.length > 0 ? story.chapters[0].order + 1 : 1;

    // Generate new chapter in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct credit
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      });

      // Create credit history
      await tx.creditHistory.create({
        data: {
          userId: userId,
          amount: -1,
          type: 'SPENT',
          description: `Chapter ${nextOrder} generation`,
          storyId: story.id
        }
      });

      // Generate chapter content (mock for now)
      const mockContinuations = [
        "The path you've chosen leads to unexpected discoveries. As you venture forward, the landscape around you begins to shift and change, revealing new mysteries at every turn. The air grows thick with anticipation as you realize that your decisions have set into motion events that cannot be undone.",
        "Your choice echoes through the narrative, creating ripples that affect everything around you. The world responds to your decision, and new possibilities emerge from the shadows. Characters you've never met before step into the light, each with their own agenda and secrets.",
        "The consequence of your action becomes immediately apparent as the story takes an unexpected turn. What seemed like a simple choice has opened doorways to realms you never imagined. The very fabric of reality seems to bend around your will, creating new adventures.",
        "Time seems to slow as your decision takes effect. The characters around you react in ways that surprise even yourself, and the plot thickens with new complications. Every step forward reveals more questions than answers, drawing you deeper into the mystery."
      ];

      const content = `Based on your choice: "${choice.text}"\n\n${mockContinuations[Math.floor(Math.random() * mockContinuations.length)]}`;

      const chapter = await tx.chapter.create({
        data: {
          storyId: story.id,
          order: nextOrder,
          content,
          choices: [
            { id: "choice1", text: "Embrace the unexpected outcome" },
            { id: "choice2", text: "Try to regain control of the situation" }
          ],
          isGenerated: true,
          promptUsed: choice.text
        }
      });

      return chapter;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch chapters for a story
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params;

    const chapters = await prisma.chapter.findMany({
      where: { storyId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 