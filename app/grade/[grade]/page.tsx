"use client";
import { UserContext } from "@/app/contexts/UserContext";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import Post from "@/app/Post";
import { Post as TPost } from "@/app/types";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Grade({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { user } = useContext(UserContext)!;
  const context = React.use(params);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchPosts = () => {
    axios
      .get(`/api/posts/grade/${context.grade}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => {
          const filtered = res.data.filter(
            (post: TPost) => !prev.includes(post)
          );

          return filtered;
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        if (err.response.status == 403) {
          setForbidden(true);
        }
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  const router = useRouter();
  return (
    <>
      <Nav />

      <InfiniteScroll
        next={fetchPosts}
        dataLength={posts.length}
        hasMore={hasMore}
        loader={<Loading />}
        className="flex flex-col items-center justify-center gap-[20vh] mt-[30vh]"
      >
        <div className="flex items-center flex-col gap-[5vh]">
          {!forbidden && (
            <h1 className="text-[1.5rem] text-center">
              You are viewing grade {context.grade}'s wall!
            </h1>
          )}
          <Button
            className="bg-[var(--custom-blue)] border border-[var(--custom-blue)] w-fit"
            onClick={() => {
              router.push(`/home`);
            }}
          >
            View All Posts
          </Button>
        </div>
        {posts.map((post) => (
          <Post post={post} key={post.id as number} />
        ))}
      </InfiniteScroll>
      {error && <Error className="text-center mt-[20vh]">{error}</Error>}
    </>
  );
}
