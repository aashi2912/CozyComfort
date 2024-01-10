import bcrypt from 'bcryptjs';
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import dbConnect from '@/helpers/dbConnect';
import Users from '@/models/Users';
import { google } from '@/helpers/constants';


const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: false,
            name: "Google",
            authorization: {
                params: {
                    prompt: "consent",
                    access_code: "offline",
                    response_type: "code"
                }
            },
            async profile(profile, tokens) {
                await dbConnect();
                let user = await Users.findOneAndUpdate({
                    provider: {
                        type: google,
                        id: profile?.sub
                    }
                }, {
                    name: profile?.name,
                    email: profile?.email,
                    image: profile?.picture,
                    emailVerified: profile?.email_verified,
                    provider: {
                        type: google,
                        id: profile?.sub
                    }
                }, {
                    new: true,
                    upsert: true,
                    timestamps: true
                });
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user?.role || "Basic",
                    verified: user?.emailVerified,
                    ...profile,
                    accessToken: tokens?.access_token,
                }
            },
        }),
        CredentialProvider({
            name: "Email and Password",
            credentials: {
                email: {
                    type: "email",
                    placeholder: "Enter your email",
                    label: "Email"
                },
                password: {
                    type: "password",
                    placeholder: "Enter your password",
                    label: "Password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password)
                    return null;
                const { email, password } = credentials;
                await dbConnect();
                let user = await Users.findOne({ email, provider: { type: "credentials" }, deleted: false });
                if (user == null || !bcrypt.compareSync(password, user?.password))
                    return null;
                return {
                    id: user?._id,
                    name: user?.name,
                    email: user?.email,
                    role: user?.role,
                    image: user?.image || null,
                    verified: user?.emailVerified,
                    ...user._doc
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60,
        updateAge: 60 * 30
    },
    callbacks: {
        async jwt(params) {
            // console.log("JWT Callback -> ", params);
            const { token, user, account } = params;
            if (user) {
                token.role = user?.role;
                token.sub = user?.id;
                token.verified = user?.verified as boolean;
                token.provider = account?.provider
            }
            return token;
        },
        async session(params) {
            // console.log("Session Callback -> ", params);
            const { session, token } = params;
            session.user.role = token.role as string;
            session.user.id = token.sub as string;
            session.user.verified = token.verified as boolean;
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
        signOut: "/sign-out",
        error: "/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    useSecureCookies: process.env.NODE_ENV !== 'development',
};

export default authOptions;