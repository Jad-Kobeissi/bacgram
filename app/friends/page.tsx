"use client";
import { useEffect, useState } from "react";
import { Post as TPost } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import Error from "../Error";
import Nav from "../Nav";
import Post from "../Post";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Friends() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const fetchPosts = async () => {
    axios
      .get("/api/posts/friends", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPosts((prev) => {
          const newPosts = [...prev, ...res.data];
          sessionStorage.setItem("friend-posts", JSON.stringify(newPosts));
          return newPosts;
        });
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    if (sessionStorage.getItem("friend-posts")) {
      setPosts((prev) => [
        ...prev,
        ...JSON.parse(sessionStorage.getItem("friend-posts") as string),
      ]);
    }
  }, []);
  useEffect(() => {
    fetchPosts();
  }, []);
  const router = useRouter();
  return (
    <>
      <Nav />
      <div className="flex items-center justify-center mt-[8rem]">
        <Button
          className="bg-[var(--custom-blue)] border border-[var(--custom-blue)] w-fit"
          onClick={() => {
            router.push(`/home`);
          }}
        >
          View All Posts
        </Button>
      </div>
      <InfiniteScroll
        dataLength={posts.length}
        hasMore={hasMore}
        loader={<Loading />}
        next={fetchPosts}
        className="flex flex-col gap-[2rem] items-center mt-[30vh]"
      >
        {posts.map((post) => (
          <Post post={post} key={post.id as number} />
        ))}
      </InfiniteScroll>
      {error && <Error className="text-center">{error}</Error>}
    </>
  );
}
