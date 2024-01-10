import dbConnect from "@/helpers/dbConnect";
import Products from "@/models/Products";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const queryParams = request.nextUrl.searchParams;
    const pageNo = queryParams.get("pageNo") ?? 1;
    const limit = queryParams.get("limit") ?? 6;

    let query: any = {};
    if (queryParams.has("freeShipping")) {
      query["freeShipping"] = true;
    }
    if (queryParams.has("minPrice") && queryParams.has("maxPrice")) {
      query["price"] = {
        $gte: queryParams.get("minPrice"),
        $lte: queryParams.get("maxPrice"),
      };
    } else if (queryParams.has("maxPrice")) {
      query["price"] = { $lte: queryParams.get("maxPrice") };
    } else if (queryParams.has("minPrice")) {
      query["price"] = { $gte: queryParams.get("minPrice") };
    }
    if (
      queryParams.has("category") &&
      isValidObjectId(queryParams.get("category"))
    ) {
      query["category"] = queryParams.get("category");
    }
    if (queryParams.has("ratings")) {
      query["rating"] = { $gte: queryParams.get("ratings") };
    }
    await dbConnect();
    const totalCount = await Products.count(query);
    const products = await Products.find(query)
      .populate("category", "name")
      .limit(Number(limit))
      .skip(Number(limit) * (Number(pageNo) - 1));
    return NextResponse.json(
      { products, totalCount, pageNo, limit },
      { status: 200 }
    );
  } catch (error) {
    console.error(`ERROR IN GET PRODUCTS -> ${error}`);
    return NextResponse.json({ error: "Something went wrong..." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, images, price, quantity, rating, category, freeShipping } =
      await request.json();
    await dbConnect();
    let product = await Products.create({
      name,
      description,
      images,
      price,
      quantity,
      rating,
      category,
      freeShipping,
      views: 0,
    });
    return NextResponse.json({ product }, { status: 201 });
  }
  catch (error) {
    console.error(`ERROR IN ADD PRODUCT -> ${error}`);
    return NextResponse.json({ error: "Something went wrong..." }, { status: 500 })
  }
}
