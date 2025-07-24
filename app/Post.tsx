import { Post as TPost } from "./types";

export default function Post({ post }: { post: TPost }) {
  return (
    <div key={post.id as number} className="border p-10 w-fit">
      <h1 className="capitalize">Username: {post.author.username}</h1>
      <h1 className="text-[1.2rem] font-bold">Title: {post.title}</h1>
      <h1>Content: {post.content}</h1>
    </div>
  );
}
