import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/authOptions";
import dbConnect from "@/helpers/dbConnect";
import Order from "@/models/Order";
import { BASKET } from "@/helpers/constants";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, { typescript: true });
export async function GET(request: NextRequest) {

    const session = await getServerSession(authOptions);
    const currency = process.env.NEXT_PUBLIC_CURRENCY as string;
    await dbConnect();
    let order = await Order.findOne({
        user: session?.user?.id,
        status: BASKET
    })
        .populate("user", "_id email name")
        .populate("orderItems.productId", "name images");
    let line_items = order.orderItems.map((item: any) => ({
        price_data: {
            currency: currency,
            unit_amount: item?.unitPrice * 100,
            product_data: {
                name: item?.productId?.name,
                images: item?.productId?.images
            },
        },
        quantity: item?.quantity
    }));
    let metadata = {
        uid: session?.user?.id as string,
        ip: request?.ip as string,
        orderid: order?._id.toString()
    }
    let checkoutSession = await stripe.checkout.sessions.create({
        client_reference_id: order?._id.toString(),
        currency: currency,
        customer_email: session?.user?.email ?? order?.user?.email,
        mode: "payment",
        submit_type: "pay",
        locale: "auto",
        shipping_address_collection: {
            allowed_countries: ['IN', 'CA', 'US', 'GB']
        },
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        line_items,
        payment_method_types: ['card'],
        phone_number_collection: {
            enabled: true
        },
        metadata,
        shipping_options: [
            {
                shipping_rate_data: {
                    type: "fixed_amount",
                    display_name: "Normal Delivery",
                    fixed_amount: {
                        currency: currency,
                        amount: 99 * 100,
                    },
                    delivery_estimate: {
                        minimum: {
                            unit: "business_day",
                            value: 3,
                        },
                        maximum: {
                            unit: "business_day",
                            value: 5,
                        },
                    },
                },
            },
            {
                shipping_rate_data: {
                    type: "fixed_amount",
                    display_name: "Fast Delivery",
                    fixed_amount: {
                        currency: currency,
                        amount: 149 * 100,
                    },
                    delivery_estimate: {
                        minimum: {
                            unit: "business_day",
                            value: 1,
                        },
                        maximum: {
                            unit: "business_day",
                            value: 3,
                        },
                    },
                },
            }
        ],
        customer_creation: "if_required",
        invoice_creation: {
            enabled: true,
        },
    })
    order.payment.reference = checkoutSession?.id;
    await order.save();
    return NextResponse.json({ checkoutId: checkoutSession?.id, checkoutUrl: checkoutSession?.url }, { status: 200 })
}