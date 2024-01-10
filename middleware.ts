import { getServerSession } from 'next-auth';
import { withAuth } from 'next-auth/middleware';

export default withAuth(async function middleware(request) {
}, {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/sign-in",
        signOut: "/sign-out",
        error: "/error",
    },
    callbacks: {
        async authorized({ token }) {
            return Boolean(token);
        },
    }
})

export const config = {
    matcher: [
        '/cart',
        "/orders",
        '/api/cart',
        '/api/cart/add-update',
        '/api/orders',
        '/api/orders/place',
        '/api/order-history'
    ],
}