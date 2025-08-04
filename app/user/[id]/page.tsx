"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import Post from "@/app/Post";
import { User as TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
export default function User({ params }: { params: Promise<{ id: string }> }) {
  const [user, setUser] = useState<TUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const context = React.use(params);

  const fetchUser = async () => {
    setLoading(true);
    axios
      .get(`/api/user/${context.id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setUser(() => {
          console.log(res.data.profilePicture);
          return res.data as TUser;
        });
        console.log(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <Nav />
      {error ? (
        <Error className="text-center mt-[25vh]">{error}</Error>
      ) : loading ? (
        <Loading className="h-screen" />
      ) : (
        user && (
          <div>
            <div className="flex flex-col items-center gap-4 mt-[25vh]">
              <div className="flex gap-4 items-center">
                <img
                  src={user.profilePicture as string}
                  alt="User profile picture"
                  className="rounded-full w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw]"
                />
                <h1 className="text-[1.5rem] font-bold">
                  Username: {user?.username}
                </h1>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-8">
              {user?.posts && user.posts.length > 0
                ? user.posts.map((post) => (
                    <Post key={post.id as number} post={post} />
                  ))
                : null}
            </div>
          </div>
        )
      )}
    </>
  );
}
