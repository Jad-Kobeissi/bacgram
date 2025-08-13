"use client";
import { UserContext } from "@/app/contexts/UserContext";
import Error from "@/app/Error";
import { motion } from "motion/react";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import Post from "@/app/Post";
import { User as TUser } from "@/app/types";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function User({ params }: { params: Promise<{ id: string }> }) {
  const [user, setUser] = useState<TUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(false);
  const [followers, setFollowers] = useState(0);
  const [friends, setFriends] = useState(false);
  const router = useRouter();
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
  useEffect(() => {
    if (!userContext?.user || !user?.id) return;
    console.log(userContext.user.following);
    setFollowed(user.followers.some((u) => u.id == userContext.user?.id));
    setFollowers(user.followers.length);

    if (
      user.followers.some((u) => u.id == userContext.user?.id) &&
      user.following.some((u) => u.id == userContext.user?.id)
    )
      setFriends(true);
  }, [user, userContext?.user]);
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
                {friends && <h1 className="contrast-[.25]">Friends</h1>}
                {userContext?.user?.id !== user.id &&
                  (followed ? (
                    <Button
                      className="bg-[var(--custom-blue)] border border-[var(--custom-blue)]"
                      onClick={() => {
                        setFollowed(false);
                        setFollowers((prev: any) => prev - 1);
                        axios
                          .post(
                            `/api/unfollow/${user.id}`,
                            {},
                            {
                              headers: {
                                Authorization: `Bearer ${getCookie("token")}`,
                              },
                            }
                          )
                          .then(() => {
                            setFriends(false);
                          })
                          .catch((err) => {
                            setError(err.response.data);
                          });
                      }}
                    >
                      Unfollow
                    </Button>
                  ) : user?.following.some(
                      (u) => u.id == userContext?.user?.id
                    ) ? (
                    <Button
                      className="bg-[var(--custom-blue)] border border-[var(--custom-blue)]"
                      onClick={() => {
                        setFollowed(true);
                        setFollowers((prev: any) => prev + 1);
                        axios
                          .post(
                            `/api/follow/${user.id}`,
                            {},
                            {
                              headers: {
                                Authorization: `Bearer ${getCookie("token")}`,
                              },
                            }
                          )
                          .then(() => {
                            if (
                              user.following.some(
                                (u) => u.id == userContext?.user?.id
                              )
                            )
                              setFriends(true);
                          })
                          .catch((err) => {
                            setError(err.response.data);
                          });
                      }}
                    >
                      Follow Back
                    </Button>
                  ) : (
                    <Button
                      className="bg-[var(--custom-blue)] border border-[var(--custom-blue)]"
                      onClick={() => {
                        setFollowed(true);
                        setFollowers((prev: any) => prev + 1);
                        axios
                          .post(
                            `/api/follow/${user.id}`,
                            {},
                            {
                              headers: {
                                Authorization: `Bearer ${getCookie("token")}`,
                              },
                            }
                          )
                          .then(() => {
                            if (
                              user.following.some(
                                (u) => u.id == userContext?.user?.id
                              )
                            )
                              setFriends(true);
                          })
                          .catch((err) => {
                            setError(err.response.data);
                          });
                      }}
                    >
                      Follow
                    </Button>
                  ))}
              </div>
            </div>
            <div className="text-center flex gap-4 justify-center">
              <motion.h1
                className="text-[1.2rem] hover:contrast-[0.25] active:contrast-[0.25]"
                onClick={() => router.push(`/followers/${user?.id}`)}
                whileTap={{ scale: 0.9 }}
              >
                Followers: {followers}
              </motion.h1>
              <motion.h1
                className="text-[1.2rem] hover:contrast-[.25] active:contrast-[.25]"
                onClick={() => router.push(`/following/${user?.id}`)}
                whileTap={{ scale: 0.9 }}
              >
                Following: {user?.following?.length}
              </motion.h1>
            </div>
            <div className="flex flex-col items-center gap-4 mt-8">
              {user?.posts && user.posts.length > 0 ? (
                user.posts.map((post) => (
                  <Post key={post.id as number} post={post} />
                ))
              ) : (
                <Error className="mt-[5vh]">
                  User has not posted any posts
                </Error>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
}
