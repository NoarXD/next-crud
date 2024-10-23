import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = params;
    await connectMongoDB();
    const post = await Post.findOne({ _id: id });
    return NextResponse.json({ post }, { status: 200 });
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { newTitle: title, newContent: content } = await req.json();
    await connectMongoDB();
    await Post.findByIdAndUpdate(id, { title, content });
    return NextResponse.json({ message: "Post updated" }, { status: 200 });
}

export async function DELETE(req, { params }) {
    const { id } = params;
    await connectMongoDB();
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: "Post daleted" }, { status: 200 });
}
