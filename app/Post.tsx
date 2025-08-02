import { Post as TPost } from "./types";

export default function Post({ post }: { post: TPost }) {
  return (
    <div key={post.id as number} className="border p-[4rem] w-fit">
      <div className="flex items-center gap-4">
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
      {post.image?.trim() != null ? (
        <img
          src={post.image as string}
          alt="Post image"
          className="md:w-[20vw] md:h-[20vw] w-[60vw] h-[60vw] rounded-lg"
        />
      ) : null}
    </div>
  );
}
