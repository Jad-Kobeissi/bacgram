import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers
      .get("Authorization")
      ?.split(" ")[1] as string;
    if (!verify(authHeader, process.env.SECRET as string)) {
      return new Response("Unauthorized", { status: 401 });
    }
    const decoded: any = decode(authHeader);

    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true,
        likedUsers: true,
        viewedUsers: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (post.likedUsers.some((user) => user.id === decoded.id)) {
      return new Response("You have already liked this post", { status: 400 });
    }

    await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        likes: post.likes + 1,
        likedUsers: {
          connect: { id: decoded.id },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        likedPosts: {
          connect: {
            id: post.id,
          },
        },
      },
    });
    return Response.json({
      message: "Post liked successfully",
    });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
