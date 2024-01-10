import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {

    interface User {
        role: string,
        verified: boolean
    }

    interface Session extends DefaultSession {
        user: {
            id: string,
            role: string,
            verified: boolean
        } & DefaultSession["user"]
    }

}

declare module "next-auth/jwt" {

    interface JWT {
        role?: string | undefined,
        verified: boolean
    }

}