"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Home() {
    const HTTP = "https://millerpost.netlify.app/";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postData, setPostData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const getPosts = async () => {
        try {
            const res = await fetch(HTTP + "api/posts", {
                method: "GET",
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed fetch posts");
            }

            const data = await res.json();
            setPostData(data.posts);
        } catch (err) {
            console.log("Error loading posts", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please complete all inputs",
            });
            return;
        }

        try {
            const res = await fetch(HTTP + "api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            });

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Creating post successfully",
                });
                getPosts();
            } else {
                throw new Error("Failed to create a post");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const editPost = async (id) => {
        await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${HTTP}api/posts/${id}`, {
                        method: "GET",
                        cache: "no-store",
                    });
                    setIsEdit(true);

                    if (!res.ok) {
                        throw new Error("Failed to fetch a post", res.status);
                    }

                    const data = await res.json();
                    setEditData(data.post);
                } catch (err) {
                    console.log(err);
                }
            }
        });
    };

    const handleEdit = async (e, id) => {
        e.preventDefault();
        const form = e.target;
        try {
            const res = await fetch(`${HTTP}api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newTitle,
                    newContent,
                }),
            });
            if (!res.ok) {
                throw new Error("Failed to update post");
            }
            getPosts();
            setIsEdit(false);
            form.reset();
        } catch (err) {
            console.log(err);
        }
    };

    const deletePost = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`${HTTP}api/posts/${id}`, {
                    method: "DELETE",
                });
                getPosts();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                });
            }
        });
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div>
            <div className="bg-gray-100 max-w-screen-md mx-auto my-20 rounded-md shadow-xl">
                <div className="container p-5">
                    {!isEdit ? (
                        <form
                            onSubmit={handleSubmit}
                            className="mx-auto w-[90%] grid gap-1"
                        >
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                type="text"
                                placeholder="Title"
                                className="w-[100%] rounded-md p-2"
                            />
                            <input
                                onChange={(e) => setContent(e.target.value)}
                                type="text"
                                placeholder="Content"
                                className="w-[100%] rounded-md p-2"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 rounded-md text-white p-1"
                            >
                                Create
                            </button>
                        </form>
                    ) : (
                        <form
                            onSubmit={() => handleEdit(event, editData._id)}
                            className="mx-auto w-[90%] grid gap-1"
                        >
                            <input
                                onChange={(e) => setNewTitle(e.target.value)}
                                type="text"
                                placeholder={editData.title}
                                className="w-[100%] rounded-md p-2"
                            />
                            <input
                                onChange={(e) => setNewContent(e.target.value)}
                                type="text"
                                placeholder={editData.content}
                                className="w-[100%] rounded-md p-2"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 rounded-md text-white p-1"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setIsEdit(false)}
                                    className="bg-red-500 rounded-md text-white p-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className="container mx-auto grid grid-cols-2 xl:grid-cols-4 mt-3 gap-5">
                {postData && postData.length > 0 ? (
                    postData.map((val) => (
                        <div
                            key={val._id}
                            className="shadow-xl p-4 rounded-xl bg-gray-100"
                        >
                            <h3 className="font-bold">{val.title}</h3>
                            <hr className="" />
                            <p>{val.content}</p>
                            <button
                                onClick={() => editPost(val._id)}
                                className="mt-2 bg-green-500 py-1 px-4 rounded-md text-white mx-1"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deletePost(val._id)}
                                className="mt-2 bg-red-500 py-1 px-4 rounded-md text-white mx-1"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
