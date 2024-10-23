import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Post from "@/models/post";

export async function POST(req) {
    const { title, content } = await req.json();
    await connectMongoDB();
    await Post.create({
        title,
        content,
    });
    return NextResponse.json({ message: "Post created" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const posts = await Post.find({});
    return NextResponse.json({ posts });
}
