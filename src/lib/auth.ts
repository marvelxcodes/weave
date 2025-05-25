import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import {  } from 'next-auth/middleware';

// Debug environment variables
console.log('🔍 [AUTH CONFIG] Checking environment variables...');
console.log('  - DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('  - NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
console.log('  - NEXTAUTH_URL exists:', !!process.env.NEXTAUTH_URL);

if (!process.env.NEXTAUTH_SECRET) {
  console.error('❌ [AUTH CONFIG] NEXTAUTH_SECRET is missing!');
}

if (!process.env.DATABASE_URL) {
  console.error('❌ [AUTH CONFIG] DATABASE_URL is missing!');
}

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔍 [AUTH] Starting authorization process...');
        console.log('  - Email provided:', !!credentials?.email);
        console.log('  - Password provided:', !!credentials?.password);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [AUTH] Missing credentials');
          return null;
        }

        console.log('🔍 [AUTH] Looking up user in database...');
        console.log('  - Email:', credentials.email);
        
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          console.log('🔍 [AUTH] Database query result:');
          console.log('  - User found:', !!user);
          console.log('  - User has password:', !!user?.password);

          if (!user || !user.password) {
            console.log('❌ [AUTH] User not found or no password');
            return null;
          }

          console.log('🔍 [AUTH] Comparing passwords...');
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('🔍 [AUTH] Password comparison result:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('❌ [AUTH] Invalid password');
            return null;
          }

          console.log('✅ [AUTH] Authorization successful for user:', user.id);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('❌ [AUTH] Database error during authorization:', error);
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      console.log('🔍 [JWT] JWT callback triggered');
      console.log('  - User provided:', !!user);
      console.log('  - Token exists:', !!token);
      
      if (user) {
        console.log('🔍 [JWT] Adding user ID to token:', user.id);
        token.id = user.id;
      }
      
      console.log('✅ [JWT] JWT callback completed');
      return token;
    },
    async session({ session, token }: any) {
      console.log('🔍 [SESSION] Session callback triggered');
      console.log('  - Session exists:', !!session);
      console.log('  - Token exists:', !!token);
      console.log('  - Session user exists:', !!session?.user);
      
      if (token && session.user) {
        console.log('🔍 [SESSION] Adding token ID to session user:', token.id);
        session.user.id = token.id as string;
      }
      
      console.log('✅ [SESSION] Session callback completed');
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}; 