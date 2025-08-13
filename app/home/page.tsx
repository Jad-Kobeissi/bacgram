"use client";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from "../contexts/UserContext";
import { Post as TPost } from "../types";
import Error from "../Error";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loading from "../Loading";
import Post from "../Post";
import Nav from "../Nav";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useContext(UserContext)!;
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const fetchPosts = async () => {
    axios
      .get("/api/posts", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data]);
        sessionStorage.setItem(
          "posts",
          JSON.stringify([...posts, ...res.data])
        );
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    if (sessionStorage.getItem("posts")) {
      setPosts(JSON.parse(sessionStorage.getItem("posts") as string));
    }
  }, []);
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <>
      <Nav />
      <h1 className="capitalize text-[2.5rem] font-bold text-center mt-[20vh]">
        Welcome {user?.username}!
      </h1>
      <div className="flex justify-center mb-[10vh] mt-[5vh]">
        <Button
          className="bg-[var(--custom-blue)] border border-[var(--custom-blue)]"
          onClick={() => {
            router.push(`/grade/${user?.grade}`);
          }}
        >
          View Your Grade's Wall
        </Button>
        <Button
          className="bg-[var(--custom-blue)] border border-[var(--custom-blue)]"
          onClick={() => {
            router.push(`/friends`);
          }}
        >
          View Your Friends' New Posts
        </Button>
      </div>
      <InfiniteScroll
        next={fetchPosts}
        hasMore={hasMore}
        loader={<Loading className="mt-0 p-0" />}
        dataLength={posts.length}
        endMessage={null}
        className="flex flex-col items-center justify-center gap-[20vh]"
      >
        {posts.map((post) => (
          <Post post={post} key={post.id as number} />
        ))}
      </InfiniteScroll>
      {error && <Error className="text-center">{error}</Error>}
    </>
  );
}
