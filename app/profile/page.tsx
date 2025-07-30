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

export default function Home() {
  const { user } = useContext(UserContext)!;
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const fetchPosts = async () => {
    axios
      .get(`/api/posts/user?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts([...posts, ...res.data]);
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <>
      <Nav />
      <h1 className="capitalize text-[2.5rem] font-bold text-center my-[20vh]">
        Hello {user?.username}!
      </h1>

      <InfiniteScroll
        next={fetchPosts}
        hasMore={hasMore}
        loader={<Loading className="w-fit h-fit" />}
        dataLength={posts.length}
        endMessage={null}
        className="flex flex-col items-center justify-center gap-[20vh] mb-[5vh]"
      >
        {posts.map((post) => (
          <Post key={post.id as number} post={post} />
        ))}
      </InfiniteScroll>
      {error && <Error className="text-center">{error}</Error>}
    </>
  );
}
