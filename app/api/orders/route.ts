import dbConnect from "@/helpers/dbConnect";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../auth/[...nextauth]/authOptions";
import { BASKET } from "@/helpers/constants";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();
    let order = await Order.findOne({
      user: session?.user?.id,
      status: BASKET,
    });
    if (!order) {
      order = await Order.create({
        user: session?.user?.id,
        status: BASKET,
      });
    }
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error(`ERROR IN GET BASKET -> ${error}`);
    return NextResponse.json(
      { error: "Something went wrong..." },
      { status: 500 }
    );
  }
}
