import { BASKET, PAID } from "@/helpers/constants";
import dbConnect from "@/helpers/dbConnect";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server"
import { BiRightDownArrowCircle } from "react-icons/bi";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
    typescript: true,
})

const endpointSecret = process.env.NEXT_PUBLIC_STRIPE_SIGNATURE as string;

export async function POST(request: NextRequest) {
    const sig = request.headers.get('stripe-signature')

    let event;

    try {
        const rawBody = await request.text();
        console.log(`Raw Body --> ${rawBody} || Signature --> ${sig} || Secret --> ${endpointSecret}`);
        event = stripe.webhooks.constructEvent(rawBody, sig as string, endpointSecret);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ err }, { status: 400 });
    }
    switch (event.type) {
        // Then define and call a function to handle the event checkout.session.completed
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            console.log(`Checkout Session Completed -> ${checkoutSessionCompleted}`);
            await fullfillOrder(checkoutSessionCompleted);
            break;
        case 'payment_intent.succeeded':
            console.log(`Payment Intent Succeded`);
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({ success: true }, { status: 200 });
}

async function fullfillOrder(checkoutSessionCompleted: Stripe.Checkout.Session) {
    await dbConnect();
    let order = await Order.findById(checkoutSessionCompleted.client_reference_id ?? checkoutSessionCompleted?.metadata?.order_id);
    if (!order || order.status !== BASKET)
        return;
    order.status = PAID;
    order.shippingDetails = {
        line1: checkoutSessionCompleted?.customer_details?.address?.line1,
        line2: checkoutSessionCompleted?.customer_details?.address?.line2,
        city: checkoutSessionCompleted?.customer_details?.address?.city,
        state: checkoutSessionCompleted?.customer_details?.address?.state,
        country: checkoutSessionCompleted?.customer_details?.address?.country,
        postalCode: checkoutSessionCompleted?.customer_details?.address?.postal_code,
    }
    order.isPaid = true;
    order.phoneNumber = checkoutSessionCompleted?.customer_details?.phone;
    order.payment.reference = checkoutSessionCompleted?.id;
    order.payment.method = checkoutSessionCompleted?.mode;
    order.total = (checkoutSessionCompleted?.amount_total ?? 0) / 100;
    order.subTotal = (checkoutSessionCompleted?.amount_subtotal ?? 0) / 100;
    order.charges = (checkoutSessionCompleted?.total_details?.amount_shipping ?? 0) / 100;
    order.orderedOn = new Date();
    await order.save();
}