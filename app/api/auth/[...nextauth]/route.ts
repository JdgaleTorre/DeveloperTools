import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, db, sessions, users, verificationTokens } from "@/app/schema";
// You can add more providers (Google, Credentials, etc.)

const handler = NextAuth({
  adapter: DrizzleAdapter(db
    , {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }
  ),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  // Optional config
  secret: process.env.NEXTAUTH_SECRET,
  //   pages: {
  //     signIn: "/auth/signin", // optional custom sign-in page
  //   },
});

export { handler as GET, handler as POST };
