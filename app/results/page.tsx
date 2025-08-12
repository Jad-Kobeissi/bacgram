"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Post, User } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import Error from "../Error";
import Nav from "../Nav";

function GetResults() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const q = params.get("q");

  const fetchUsers = () => {
    setUsers([]);
    axios
      .get(`/api/user?q=${q}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setUsers((prev) => {
          const filtered = res.data.filter(
            (user: User) => !prev.some((u) => u.id == user.id)
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
    fetchUsers();
  }, []);
  const router = useRouter();
  return (
    <>
      <Nav />
      <InfiniteScroll
        next={fetchUsers}
        hasMore={hasMore}
        dataLength={users.length}
        loader={<Loading />}
        className="flex flex-col gap-[5vh] items-center mt-[30vh]"
      >
        {users.map((user) => (
          <div
            key={user.id as number}
            className="flex items-center gap-[1rem]"
            onClick={() => {
              router.push(`/user/${user.id}`);
            }}
          >
            <img
              src={user.profilePicture as string}
              alt="Profile picture"
              className="w-[4rem] h-[4rem] rounded-full"
            />
            <h1 className="text-[1.3rem]">{user.username}</h1>
          </div>
        ))}
      </InfiniteScroll>
      {error && <Error className="text-center">{error}</Error>}
    </>
  );
}
export default function Results() {
  return (
    <Suspense fallback={<Loading className="h-screen" />}>
      <GetResults />
    </Suspense>
  );
}
