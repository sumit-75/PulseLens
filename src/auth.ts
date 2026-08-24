import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
    Credentials({
      id: 'demo-login',
      name: 'Demo Account',
      credentials: {},
      async authorize() {
        return {
          id: 'usr_demo_admin',
          name: 'Demo Engineer',
          email: 'engineer@pulselens.io',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.sub as string) || 'user';
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || 'pulselens-development-secret-key-32-chars-long-minimum',
});
