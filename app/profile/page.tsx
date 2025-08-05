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
import Image from "next/image";

export default function Profile() {
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
        console.log(res.data);
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
      <div className="mt-[30vh] mb-[5vh] flex flex-col items-center justify-center gap-4">
        <h1 className="capitalize text-[2.5rem] font-bold text-center flex items-center justify-center gap-4">
          Hello{" "}
          <img
            src={user?.profilePicture as string}
            alt="Profile picture"
            className="md:w-[5vw] md:h-[5vw] h-[10vw] w-[10vw] rounded-full"
          />{" "}
          {user?.username}!
        </h1>
        <div className="text-center">
          <h1>Followers: {user?.followers?.length}</h1>
          <h1>Following: {user?.following?.length}</h1>
        </div>
      </div>

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
