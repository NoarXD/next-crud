import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Post from "@/models/post";

export async function POST(req) {
    try {
        const { title, content } = await req.json();

        await connectMongoDB();

        await Post.create({
            title,
            content,
        });

        return NextResponse.json({ message: "Post created" }, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);

        return NextResponse.json(
            { message: "Failed to create post", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const posts = await Post.find({});
        return NextResponse.json({ posts });
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Failed to get post", error: err.message },
            { status: 500 }
        );
    }
    
}
