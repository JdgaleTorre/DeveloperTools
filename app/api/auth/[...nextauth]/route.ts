import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";
// You can add more providers (Google, Credentials, etc.)

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
