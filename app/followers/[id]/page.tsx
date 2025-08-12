"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { User as TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Followers({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [followers, setFollowers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const context = React.use(params);
  const id = context.id;
  const router = useRouter();
  const fetchFollowing = () => {
    axios
      .get(`/api/user/followers/${id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setFollowers((prev) => {
          const filtered = res.data.filter(
            (u: TUser) => !prev.some((p) => p.id === u.id)
          );

          return [...prev, ...filtered];
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchFollowing();
  }, []);
  return (
    <>
      <Nav />
      <InfiniteScroll
        dataLength={followers.length}
        loader={<Loading className="mt-[20vh]" />}
        hasMore={hasMore}
        next={fetchFollowing}
        className="flex flex-col gap-[1rem] items-center mt-[30vh]"
      >
        {followers.map((follower) => (
          <div
            key={follower.id as number}
            className="flex items-center gap-[2rem]"
            onClick={() => router.push(`/user/${follower.id}`)}
          >
            <img
              src={follower.profilePicture as string}
              alt="User profile picture"
              className="w-[4rem] h-[4rem] rounded-full"
            />
            <h1 className="capitalize font-bold">{follower.username}</h1>
          </div>
        ))}
      </InfiniteScroll>
      {error && <Error className="text-center mt-[30vh]">{error}</Error>}
    </>
  );
}
