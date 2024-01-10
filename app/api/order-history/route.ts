import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "../auth/[...nextauth]/authOptions";
import dbConnect from "@/helpers/dbConnect";
import Order from "@/models/Order";
import { BASKET } from "@/helpers/constants";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();
    const orders = await Order.find({
      user: session?.user?.id,
      status: { $ne: BASKET },
    })
      .populate("orderItems.productId", "name images")
      .populate("user", "name email")
      .sort({ createdAt: "desc" });
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error(`ERROR IN ORDER HISTORY -> ${error}`);
    return NextResponse.json({ error }, { status: 500 });
  }
}
