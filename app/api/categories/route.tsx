import dbConnect from "@/helpers/dbConnect";
import Categories from "@/models/Categories";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    let categories = await Categories.find({
      deleted: false,
    });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error(`ERROR IN CATEGORIES -> ${error}`);
    return NextResponse.json({ error: "Something went wrong..." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: "Please provide name to create category." },
        { status: 400 }
      );
    }
    await dbConnect();
    let category = await Categories.findOne({
      name,
    });
    if (category) {
      return NextResponse.json(
        { error: `Category with ${name} already exists.` },
        { status: 400 }
      );
    }
    category = await Categories.create({
      name,
      description,
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error(`ERROR IN CATEGORIES -> ${error}`);
    return NextResponse.json({ error: "Something went wrong..." }, { status: 500 })
  }
}
