import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const { handlers } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            await connectMongoDB();
            try {
                let dbUser = await User.findOne({ email: user.email });

                if (!dbUser) {
                    const randomPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);

                    dbUser = await User.create({
                        name: user.name || "Google User",
                        email: user.email,
                        password: randomPassword,
                        address: "Not provided yet",
                        role: "user",
                    });
                }

                const customToken = jwt.sign(
                    { id: dbUser._id.toString(), email: dbUser.email, role: dbUser.role },
                    process.env.JWT_SECRET!,
                    { expiresIn: '7d' }
                );

                const cookieStore = await cookies();
                cookieStore.set({
                    name: 'token',
                    value: customToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60, // 7 days
                });

                return true;
            } catch (error) {
                console.error("Error during Google sign-in:", error);
                return false;
            }
        },
        async jwt({ token, user }) {
            await connectMongoDB();
            if (user) {
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
});

export const GET = handlers.GET;
export const POST = handlers.POST;