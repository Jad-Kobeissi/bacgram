import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";
import { m } from "motion/react";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }
    const decoded: any = decode(authHeader);

    await prisma.post.update({
      where: { id: post.id },
      data: {
        likes: post.likes - 1,
        likedUsers: {
          disconnect: { id: decoded.id },
        },
      },
    });

    return Response.json({ message: "Post disliked successfully" });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
