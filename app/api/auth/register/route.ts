import Users from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../helpers/dbConnect";
import bcrypt from "bcryptjs";
import { credentials } from "@/helpers/constants";

export async function POST(request: NextRequest) {
    try {
        const { email, name, password } = await request.json();
        if (!email || !name || !password) {
            throw new Error(`Invalid user details`);
        }
        await dbConnect();
        let user = await Users.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User already exist." }, { status: 400 });
        }
        user = await Users.create({
            name,
            email,
            password: bcrypt.hashSync(password),
            provider: {
                type: credentials
            }
        })
        return NextResponse.json({ user }, { status: 201 })
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}