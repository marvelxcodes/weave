import { NextRequest, NextResponse } from 'next/server';
import { externalApiService } from '@/lib/externalApi';

// Local fallback genres
const LOCAL_GENRES = [
  { genre_id: 1, genre_name: 'Fantasy' },
  { genre_id: 2, genre_name: 'Sci-Fi' },
  { genre_id: 3, genre_name: 'Mystery' },
  { genre_id: 4, genre_name: 'Romance' },
  { genre_id: 5, genre_name: 'Horror' },
  { genre_id: 6, genre_name: 'Adventure' },
  { genre_id: 7, genre_name: 'Thriller' },
  { genre_id: 8, genre_name: 'Historical' },
  { genre_id: 9, genre_name: 'Comedy' },
  { genre_id: 10, genre_name: 'Drama' }
];

export async function GET(request: NextRequest) {
  try {
    // Try to get genres from external API first
    const externalResult = await externalApiService.getGenres();
    
    if (externalResult.success && externalResult.data) {
      return NextResponse.json({
        genres: externalResult.data,
        source: 'external'
      });
    }

    // Fallback to local genres
    console.warn('Using local fallback for genres');
    
    return NextResponse.json({
      genres: LOCAL_GENRES,
      source: 'local'
    });
  } catch (error) {
    console.error('Get genres error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 