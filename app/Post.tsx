import { useContext, useState } from "react";
import { Post as TPost } from "./types";
import { UserContext } from "./contexts/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Post({ post }: { post: TPost }) {
  const { user } = useContext(UserContext)!;
  if (!user) throw new Error("User context is not available");

  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(
    user.likedPosts?.some((p) => p.id === post.id)
  );
  const router = useRouter();
  return (
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
      <h1>Content: {post.content}</h1>
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
            className="bg-[var(--custom-purple)] text-white border border-[var(--custom-purple)]"
            onClick={() => {
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
            className="bg-[var(--custom-purple)] text-white border border-[var(--custom-purple)]"
            onClick={() => {
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
                  throw new Error("Failed to delete post: " + err.message);
                });
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}
