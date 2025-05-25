import { NextRequest, NextResponse } from 'next/server';

// Hardcoded prompt suggestions for different genres
const GENRE_SUGGESTIONS: Record<string, string[]> = {
  fantasy: [
    'A young mage discovers an ancient spellbook that contains forbidden magic',
    'Dragons have returned to the realm after centuries of absence',
    'A magical portal opens in your backyard leading to an enchanted forest',
    'You inherit a mysterious castle with rooms that change every night',
    'An ordinary person gains the ability to speak with mythical creatures'
  ],
  'sci-fi': [
    'Humanity receives a mysterious signal from deep space',
    'Time travel is invented but comes with unexpected consequences',
    'AI robots begin to develop emotions and consciousness',
    'A space colony loses contact with Earth for decades',
    'Scientists discover a parallel universe where history unfolded differently'
  ],
  mystery: [
    'A detective investigates a murder where the victim appears to be still alive',
    'Strange disappearances occur in a small town every full moon',
    'An antique shop owner finds a diary that predicts future crimes',
    'A locked room murder with no possible way for the killer to escape',
    'Missing persons cases all lead back to the same abandoned mansion'
  ],
  romance: [
    'Two rival coffee shop owners are forced to work together',
    'A wedding planner falls for the bride\'s brother',
    'Childhood sweethearts reunite after twenty years apart',
    'A fake relationship for a family wedding turns into something real',
    'Love letters from the past help two strangers find each other'
  ],
  horror: [
    'A family moves into a house where the previous owners vanished mysteriously',
    'Strange things happen when you look in mirrors after midnight',
    'A camping trip goes wrong when something starts hunting the group',
    'An old music box plays a tune that drives people to madness',
    'Children in the neighborhood start disappearing one by one'
  ],
  adventure: [
    'A treasure map leads to an island that doesn\'t appear on any chart',
    'Explorers discover a lost civilization deep in the Amazon rainforest',
    'A storm shipwrecks you on an uncharted island with dangerous secrets',
    'Ancient ruins hold the key to preventing a global catastrophe',
    'A race against time to find a cure in the most dangerous places on Earth'
  ],
  thriller: [
    'You witness a crime but the perpetrator knows where you live',
    'A journalist uncovers a conspiracy that goes to the highest levels of government',
    'Someone is stalking you and leaving cryptic messages',
    'A routine flight becomes a nightmare when passengers start acting strangely',
    'You receive a phone call from someone claiming to be your future self'
  ],
  historical: [
    'A time traveler accidentally changes a crucial moment in history',
    'Letters discovered in an old house reveal a secret from World War II',
    'A young person becomes involved in the Underground Railroad',
    'Life in a medieval castle during a siege',
    'The story of an immigrant family arriving at Ellis Island'
  ],
  comedy: [
    'A case of mistaken identity leads to hilarious complications',
    'Roommates with completely opposite lifestyles must learn to coexist',
    'A wedding where everything that can go wrong does go wrong',
    'A person tries to impress their crush but keeps making embarrassing mistakes',
    'A family reunion brings together eccentric relatives with surprising secrets'
  ],
  drama: [
    'A family secret is revealed that changes everything',
    'Two estranged siblings must work together to save the family business',
    'A teacher makes a life-changing impact on a troubled student',
    'A person must choose between following their dreams or family obligations',
    'The story of forgiveness and redemption after a tragic mistake'
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { genre } = await request.json();

    if (!genre) {
      return NextResponse.json(
        { error: 'Missing required field: genre' },
        { status: 400 }
      );
    }

    const suggestions = GENRE_SUGGESTIONS[genre.toLowerCase()] || GENRE_SUGGESTIONS['adventure'];

    return NextResponse.json({
      suggestions: suggestions,
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 