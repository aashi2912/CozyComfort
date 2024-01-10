import Products from "@/models/Products";
import dbConnect from "@/helpers/dbConnect";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const { slug } = params;
        if (!slug || !isValidObjectId(slug)) {
            return NextResponse.json({ error: `Invalid product` }, { status: 400 })
        }
        await dbConnect();
        let product = await Products.findOne({
            _id: slug,
            deleted: false
        }).populate("category", "name");
        if (!product) {
            return NextResponse.json({ error: `Invalid product` }, { status: 400 })
        }
        await product.save();
        return NextResponse.json({ product }, { status: 200 });
    }
    catch (error) {
        console.error(`ERROR IN GET PRODUCT -> ${error}`);
        return NextResponse.json({ error }, { status: 500 })
    }

}