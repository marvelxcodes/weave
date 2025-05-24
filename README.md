# WEAVE - Interactive 3D Storytelling Platform

A beautiful interactive 3D storytelling website where users can create immersive story experiences with choices that shape the narrative. Built with Next.js, React Three Fiber, Prisma, and NextAuth.

## Features

### 🎨 **Beautiful 3D Interface**
- Immersive antique library environment with React Three Fiber
- Interactive floating magical book with particle effects
- Smooth animations and atmospheric lighting

### 📚 **Story Creation System**
- AI-powered story generation (currently with mock data)
- Chapter-by-chapter progression based on user choices
- Credit-based system for story generation
- Story history tracking and navigation

### 🔐 **User Authentication**
- NextAuth.js integration with credentials and OAuth support
- User registration with email/password
- Session management and protected routes

### 💰 **Credit System**
- Starting credits for new users (10 free credits)
- 1 credit per chapter generation
- Credit history tracking
- Future: Credit purchase system

### 🌐 **Story Library**
- Browse public stories created by other users
- Search and filter functionality
- Like and view tracking
- Free reading of all public stories

### 🎯 **Technical Features**
- PostgreSQL database with Prisma ORM
- Server-side rendering with Next.js 15
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Beautiful animations with Framer Motion

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **3D Graphics**: React Three Fiber, React Three Drei
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with antique theme
- **Fonts**: Cinzel & Cinzel Decorative (Google Fonts)

## Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd weave
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/weave_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## Database Schema

The application uses the following main models:

- **User**: User accounts with credits and authentication
- **Story**: User-created stories with metadata
- **Chapter**: Individual story chapters with choices
- **CreditHistory**: Track credit transactions
- **StoryLike**: User likes on stories

## Usage

### Creating Stories
1. Sign up for an account (get 10 free credits)
2. Click the magical book in the 3D scene
3. Enter a story prompt
4. Make choices to continue the narrative
5. Each chapter generation costs 1 credit

### Reading Stories
1. Visit the "Browse Stories" page
2. Search and filter public stories
3. Click on any story to read for free
4. Like stories to show appreciation

### Credit System
- New users start with 10 credits
- Each chapter generation costs 1 credit
- Reading stories is always free
- Future: Credit purchase system

## Project Structure

```
src/
├── app/                  # Next.js app router
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   └── stories/         # Story browsing pages
├── components/          # React components
│   ├── 3D/             # Three.js components
│   ├── UI/             # Interface components
│   └── providers/      # Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── types/              # TypeScript definitions
└── generated/          # Prisma generated files
```

## Development

### Build for Production
```bash
pnpm build
```

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate new migration
npx prisma migrate dev --name migration-name
```

### Code Quality
```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Future Enhancements

### AI Integration
- OpenAI API integration for story generation
- GPT-4 powered narrative continuation
- Customizable AI parameters

### Enhanced Features
- Story collaboration system
- Advanced search and filtering
- Story categories and tags
- User profiles and followers
- Story ratings and reviews

### Technical Improvements
- Real-time collaboration
- Story export functionality
- Mobile app version
- Advanced 3D environments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please create an issue in the repository.

---

**WEAVE** - Where stories come alive in 3D ✨
