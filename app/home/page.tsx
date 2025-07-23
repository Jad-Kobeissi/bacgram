"use client";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Post } from "../types";

export default function Home() {
  const { user } = useContext(UserContext)!;
  const [posts, setPosts] = useState<Post[]>([]);
  return (
    <>
      <h1 className="capitalize text-[2.5rem] font-bold text-center my-[20vh]">
        Welcome {user?.username}!
      </h1>
      {posts.map((post) => (
        <>
          <h1>{post.author.username}</h1>
        </>
      ))}
    </>
  );
}
