import dbConnect from "@/helpers/dbConnect";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/authOptions";
import { BASKET } from "@/helpers/constants";
import Products from "@/models/Products";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.redirect(`/sign-in`);
        }

        const { productId, quantity } = await request.json();
        if (!productId) {
            return NextResponse.json({ error: "Something went wrong." }, { status: 400 });
        }

        await dbConnect();
        let product = await Products.findById(productId);
        let order = await Order.findOne(
            { user: session?.user?.id, status: BASKET },
        );


        if (quantity === 0) {
            order.orderItems = order.orderItems.filter((o: any) => !o.productId.equals(productId))
        }
        else {
            let orderItem = order.orderItems.find((o: any) => o.productId.equals(productId));

            if (orderItem) {
                orderItem.quantity = quantity;
                orderItem.totalPrice = product?.price * quantity
            }
            else {
                order.orderItems.push({
                    productId,
                    quantity,
                    unitPrice: product?.price,
                    totalPrice: product?.price * quantity
                });
            }
        }
        order.total = order
            .orderItems
            .reduce((total: number, item: any) => total += item.totalPrice, 0);
        await order.save();

        return NextResponse.json({ order }, { status: 200 });
    }
    catch (error) {
        console.error(`ERROR IN ADD_UPDATE CART -> ${error}`);
        return NextResponse.json({ error: "Something went wrong...", err: error }, { status: 500 })
    }
}