import { NextRequest, NextResponse } from 'next/server';
import { externalApiService } from '@/lib/externalApi';

// Local fallback authors (matching the updated POPULAR_AUTHORS)
const LOCAL_AUTHORS = [
  { author_id: 1, author_name: 'J.R.R. Tolkien', genre_id: null },
  { author_id: 2, author_name: 'George R.R. Martin', genre_id: null },
  { author_id: 3, author_name: 'Ursula K. Le Guin', genre_id: null },
  { author_id: 4, author_name: 'Brandon Sanderson', genre_id: null },
  { author_id: 5, author_name: 'Robin Hobb', genre_id: null },
  { author_id: 6, author_name: 'Isaac Asimov', genre_id: null },
  { author_id: 7, author_name: 'Philip K. Dick', genre_id: null },
  { author_id: 8, author_name: 'Arthur C. Clarke', genre_id: null },
  { author_id: 10, author_name: 'Ray Bradbury', genre_id: null },
  { author_id: 11, author_name: 'Agatha Christie', genre_id: null },
  { author_id: 12, author_name: 'Arthur Conan Doyle', genre_id: null },
  { author_id: 13, author_name: 'Dorothy L. Sayers', genre_id: null },
  { author_id: 14, author_name: 'Raymond Chandler', genre_id: null },
  { author_id: 16, author_name: 'Stephen King', genre_id: null },
  { author_id: 17, author_name: 'H.P. Lovecraft', genre_id: null },
  { author_id: 18, author_name: 'Clive Barker', genre_id: null },
  { author_id: 19, author_name: 'Shirley Jackson', genre_id: null },
  { author_id: 20, author_name: 'Edgar Allan Poe', genre_id: null },
  { author_id: 21, author_name: 'Jane Austen', genre_id: null },
  { author_id: 22, author_name: 'Nicholas Sparks', genre_id: null },
  { author_id: 23, author_name: 'Nora Roberts', genre_id: null },
  { author_id: 24, author_name: 'Emily Brontë', genre_id: null },
  { author_id: 26, author_name: 'Jules Verne', genre_id: null },
  { author_id: 27, author_name: 'Robert Louis Stevenson', genre_id: null },
  { author_id: 28, author_name: 'Ernest Hemingway', genre_id: null }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genreId = searchParams.get('genre_id');

    // Try to get authors from external API first
    const externalResult = await externalApiService.getAuthors(
      genreId ? parseInt(genreId) : undefined
    );
    
    if (externalResult.success && externalResult.data) {
      return NextResponse.json({
        authors: externalResult.data,
        source: 'external'
      });
    }

    // Fallback to local authors
    console.warn('Using local fallback for authors');
    
    let authors = LOCAL_AUTHORS;
    
    // Filter by genre_id if provided (though our local data doesn't have genre associations)
    if (genreId) {
      // For local fallback, we don't filter by genre since our data doesn't have genre associations
      // In a real implementation, you'd want to have proper genre-author relationships
    }
    
    return NextResponse.json({
      authors: authors,
      source: 'local'
    });
  } catch (error) {
    console.error('Get authors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 