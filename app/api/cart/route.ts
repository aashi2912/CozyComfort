import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/authOptions";
import dbConnect from "@/helpers/dbConnect";
import Order from "@/models/Order";
import { BASKET } from "@/helpers/constants";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.redirect(`/sign-in`);
    }
    await dbConnect();
    let order = await Order.findOne({
      user: session?.user?.id,
      status: BASKET,
    }).populate("orderItems.productId", "name images");
    if (!order) {
      order = await Order.create({
        user: session?.user?.id,
        status: BASKET,
        orderItems: [],
        totalPrice: 0,
      });
    }
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error(`ERROR IN CART -> ${error}`);
    return NextResponse.json(
      { error: "Something went wrong..." },
      { status: 500 }
    );
  }
}
