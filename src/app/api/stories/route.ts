import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch public stories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';

    const skip = (page - 1) * limit;

    const where = {
      isPublic: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      }),
      ...(tag && {
        tags: { has: tag }
      })
    };

    const stories = await prisma.story.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        chapters: {
          select: {
            id: true,
            order: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            likes_users: true,
            chapters: true
          }
        }
      },
      orderBy: [
        { likes: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    });

    const total = await prisma.story.count({ where });

    return NextResponse.json({
      stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new story
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;

    const { title, description, isPublic, initialPrompt } = await request.json();

    if (!title || !initialPrompt) {
      return NextResponse.json(
        { error: 'Title and initial prompt are required' },
        { status: 400 }
      );
    }

    // Create story and first chapter in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create story
      const story = await tx.story.create({
        data: {
          title,
          description,
          isPublic: isPublic || false,
          authorId: userId
        }
      });

      // Generate first chapter (mock for now)
      const mockStories = [
        "You find yourself standing at the edge of an ancient forest. The trees whisper secrets of old, their gnarled branches reaching toward a sky painted with the colors of twilight. A mysterious path winds deeper into the woods, while another leads to a distant castle perched on a hill.",
        "The cobblestone path beneath your feet tells tales of countless travelers who have walked this way before. As you approach the imposing castle gates, you notice they stand slightly ajar. A warm light flickers from within, but you also hear the distant sound of approaching hoofbeats.",
        "Deep within the forest, ancient magic stirs. Luminescent mushrooms light your way as you discover a clearing where a crystal-clear spring bubbles up from the earth. An old hermit sits beside it, his eyes twinkling with wisdom. He gestures for you to approach."
      ];

      const storyContent = initialPrompt + " " + mockStories[Math.floor(Math.random() * mockStories.length)];
      
      const chapter = await tx.chapter.create({
        data: {
          storyId: story.id,
          order: 1,
          content: storyContent,
          choices: [
            { id: "choice1", text: "Continue the adventure" },
            { id: "choice2", text: "Take a different path" }
          ],
          isGenerated: true,
          promptUsed: initialPrompt
        }
      });

      return { story, chapter };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 