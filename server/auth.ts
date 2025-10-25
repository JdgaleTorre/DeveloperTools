import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from "next-auth";

import { db } from "@/server/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "@/app/schema";
import GitHubProvider from "next-auth/providers/github";



declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}


export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
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
}

export const getServerAuthSession = () => getServerSession(authOptions);