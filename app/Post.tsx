import { Suspense, useContext, useEffect, useRef, useState } from "react";
import TimeAgo from "react-timeago";
import { Post as TPost } from "./types";
import { UserContext } from "./contexts/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

export default function Post({ post }: { post: TPost }) {
  const { user } = useContext(UserContext)!;
  const dialogRef = useRef<HTMLDialogElement>(null);
  if (!user) throw new Error("User context is not available");

  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    console.log(post);
    if (!post.likedUsers || !user) return;
    console.log("Work 2");
    setLiked(post.likedUsers.some((u) => u.id == user.id));
  }, [post.likedUsers, user]);
  const router = useRouter();
  return (
    <Suspense fallback={<Loading />}>
      {post != null && (
        <div
          key={post.id as number}
          className="border p-[4rem] w-fit"
          onClick={() => router.push(`/post/${post.id}`)}
        >
          <div
            className="flex items-center gap-4"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/user/${post.author.id}`);
            }}
          >
            <img
              src={post.author.profilePicture as string}
              alt="User profile picture"
              className="md:w-[3vw] md:h-[3vw] h-[10vw] w-[10vw] rounded-full"
            />
            <h1 className="capitalize text-[1.3rem]">
              Username: {post.author.username}
            </h1>
          </div>
          <h1 className="text-[1.2rem] font-bold">Title: {post.title}</h1>
          <p className="contrast-[.25]">Content: {post.content}</p>
          <h1>Likes: {likes as number}</h1>
          {post.image?.trim() != null ? (
            <img
              src={post.image as string}
              alt="Post image"
              className="md:w-[20vw] md:h-[20vw] w-[60vw] h-[60vw] rounded-lg"
            />
          ) : null}
          <div className="flex items-center gap-4 mt-4">
            {liked ? (
              <Button
                className="bg-[var(--custom-blue)] text-white border border-[var(--custom-blue)]"
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(false);
                  setLikes((prev) => (prev as number) - 1);
                  axios
                    .post(
                      `/api/posts/dislike/${post.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .catch((err) => {
                      throw new Error("Failed to dislike post: " + err.message);
                    });
                }}
              >
                Dislike
              </Button>
            ) : (
              <Button
                className="bg-[var(--custom-blue)] text-white border border-[var(--custom-blue)]"
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(true);
                  setLikes((prev) => (prev as number) + 1);
                  axios
                    .post(
                      `/api/posts/like/${post.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .catch((err) => {
                      throw new Error("Failed to like post: " + err.message);
                    });
                }}
              >
                Like
              </Button>
            )}
            {post.authorId === user.id ? (
              <Button
                variant={"destructive"}
                className="border border-red-600 hover:bg-transparent active:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  dialogRef.current?.showModal();
                }}
              >
                Delete
              </Button>
            ) : null}
            <dialog
              ref={dialogRef}
              className="min-h-screen min-w-screen bg-transparent backdrop-blur-md rounded-md"
            >
              <div className="flex items-center justify-center h-screen flex-col">
                <div className="bg-[#121212] flex flex-col items-center gap-[1rem] py-[4rem] px-[3rem]">
                  <h1 className="text-[1.5rem] text-white">
                    Are you sure you want to delete this post?
                  </h1>
                  <div className="gap-[2rem] flex items-center">
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        axios
                          .delete(`/api/posts/${post.id}`, {
                            headers: {
                              Authorization: `Bearer ${getCookie("token")}`,
                            },
                          })
                          .then(() => {
                            window.location.reload();
                          })
                          .catch((err) => {
                            throw new Error(
                              "Failed to delete post: " + err.message
                            );
                          });
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        dialogRef.current?.close();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
          <h1 className="text-[0.7rem] mt-[.5rem] contrast-[.25]">
            <TimeAgo date={post.createdAt} />
          </h1>
        </div>
      )}
    </Suspense>
  );
}
