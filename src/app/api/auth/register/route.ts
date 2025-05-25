import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { externalApiService } from '@/lib/externalApi';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  
  try {
    const { name, email, password, preferred_authors } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        preferredAuthors: preferred_authors || [],
      }
    });

    console.log(user)

      try {
        await externalApiService.registerUserPreferences({
          user_id: user.id,
          email: user.email,
          name: user.name || '',
          preferred_authors: preferred_authors,
          profile_pic_url: ""
        });
      } catch (error) {
        // Log error but don't fail the registration
        console.error('⚠️ [REGISTER] Failed to sync with external API:', error);
      }

      return NextResponse.json({
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          preferred_authors: user.preferredAuthors,
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('connect')) {
        console.error('❌ [REGISTER] Database connection error detected');
        return NextResponse.json(
          { error: 'Database connection failed. Please check your environment configuration.' },
          { status: 500 }
        );
      }
      if (error.message.includes('NEXTAUTH_SECRET')) {
        console.error('❌ [REGISTER] NextAuth configuration error detected');
        return NextResponse.json(
          { error: 'Authentication configuration missing. Please check environment variables.' },
          { status: 500 }
        );
      }
      if (error.message.includes('Environment variable not found')) {
        console.error('❌ [REGISTER] Environment variable missing');
        return NextResponse.json(
          { error: 'Environment configuration missing. Please check your .env file.' },
          { status: 500 }
        );
      }
    } else {
      console.error('❌ [REGISTER] Non-Error object thrown:', JSON.stringify(error));
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please check server logs for details.' },
      { status: 500 }
    );
  }
} 