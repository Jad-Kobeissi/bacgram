"use client";
import { UserContext } from "@/app/contexts/UserContext";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { User as TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Following({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useContext(UserContext)!;
  const [following, setFollowing] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const context = React.use(params);
  const id = context.id;
  const router = useRouter();
  const fetchFollowing = () => {
    axios
      .get(`/api/user/following/${id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setFollowing((prev) => {
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
        dataLength={following.length}
        loader={<Loading className="mt-[20vh]" />}
        hasMore={hasMore}
        next={fetchFollowing}
        className="flex flex-col gap-[1rem] items-center mt-[30vh]"
      >
        {following.map((user) => (
          <div
            key={user.id as number}
            className="flex items-center gap-[2rem]"
            onClick={() => router.push(`/user/${user.id}`)}
          >
            <img
              src={user.profilePicture as string}
              alt="User profile picture"
              className="w-[4rem] h-[4rem] rounded-full"
            />
            <h1 className="capitalize font-bold">{user.username}</h1>
          </div>
        ))}
      </InfiniteScroll>
      {error && <Error className="text-center mt-[30vh]">{error}</Error>}
    </>
  );
}
