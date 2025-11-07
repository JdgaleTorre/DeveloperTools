import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from "next-auth";

import { db } from "@/server/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "@/app/schema";
import GitHubProvider from "next-auth/providers/github";
import { eq, and } from "drizzle-orm";



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
        async signIn({ user, account }) {
            if (!user?.email || !account) return true;

            // Check for existing user by email
            const existingUsers = await db
                .select()
                .from(users)
                .where(eq(users.email, user.email));

            const existingUser = existingUsers[0];

            if (existingUser) {
                // Check if this provider is already linked
                const linkedAccounts = await db
                    .select()
                    .from(accounts)
                    .where(
                        and(
                            eq(accounts.userId, existingUser.id),
                            eq(accounts.provider, account.provider)
                        )
                    );

                if (linkedAccounts.length === 0) {
                    // Link this new provider to existing user
                    await db.insert(accounts).values({
                        user_id: existingUser.id,
                        type: account.type as any,
                        provider: account.provider!,
                        provider_account_id: account.providerAccountId!,
                        access_token: account.access_token ?? null,
                        token_type: account.token_type ?? null,
                        scope: account.scope ?? null,
                        id_token: account.id_token ?? null,
                        refresh_token: account.refresh_token ?? null,
                        expires_at: account.expires_at ?? null,
                        session_state: account.session_state ?? null,
                    } as any);
                }
            }

            return true;
        },
        async redirect({ url, baseUrl }) {
            // If signing in from the sign-in page, always go to dashboard
            if (url.endsWith("/")) return `${baseUrl}/dashboard`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
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
    // pages: {
    //     signIn: "/dashboard", // optional custom sign-in page
    // },
}

export const getServerAuthSession = () => getServerSession(authOptions);