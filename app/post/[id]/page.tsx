"use client";
import React, { useEffect, useState } from "react";
import { Post as TPost } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { Button } from "@/components/ui/button";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<TPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const context = React.use(params);
  const fetchPost = async () => {
    setLoading(true);
    axios
      .get(`/api/posts/${context.id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token") as string}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPost(res.data as TPost);
      })
      .catch((err) => setError(err.response.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <>
      <Nav />
      {loading && <Loading className="w-screen h-screen" />}
      {error && (
        <Error className="w-screen h-screen flex items-center justify-center">
          {error}
        </Error>
      )}
      {post != null && (
        <div className="flex items-center justify-center flex-col h-screen gap-[2vh]">
          <div className="flex gap-4 items-center">
            <img
              src={post.author.profilePicture as string}
              alt="User profile picture"
              className="rounded-full w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw]"
            />
            <h1 className="text-[1.5rem]">Username: {post.author.username}</h1>
          </div>
          <h1 className="text-[2rem] font-bold">Title: {post.title}</h1>
          <p className="text-[1.3rem]">Content: {post.content}</p>
          <Button className="text-[1.3rem] bg-[var(--custom-blue)] px-[3vw]">
            Like
          </Button>
        </div>
      )}
    </>
  );
}
