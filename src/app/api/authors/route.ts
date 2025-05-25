import { NextRequest, NextResponse } from 'next/server';
import { externalApiService } from '@/lib/externalApi';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genreId = searchParams.get('genre_id');

    const externalResult = await externalApiService.getAuthors(
      genreId ? parseInt(genreId) : undefined
    );
    
    if (externalResult.success && externalResult.data) {
      return NextResponse.json({
        authors: externalResult.data,
        source: 'external'
      });
    }

    return NextResponse.json({
      authors: externalResult.data,
      source: 'external'
    });
  } catch (error) {
    console.error('Get authors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 