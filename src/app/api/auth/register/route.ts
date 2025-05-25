import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { externalApiService } from '@/lib/externalApi';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, preferred_authors } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in local database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        preferredAuthors: preferred_authors || [],
      }
    });

    // Sync user preferences with external API (non-blocking)
    if (preferred_authors && preferred_authors.length > 0) {
      try {
        await externalApiService.registerUserPreferences({
          user_id: user.id,
          email: user.email,
          name: user.name || '',
          preferred_authors: preferred_authors,
          profile_pic_url: ""
        });
        console.log('User preferences synced with external API');
      } catch (error) {
        // Log error but don't fail the registration
        console.error('Failed to sync with external API:', error);
      }
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 