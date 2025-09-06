import { prisma, storage } from "@/app/api/init";
import { deleteObject, ref } from "firebase/storage";
import { decode, verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        likedPosts: true,
        posts: {
          include: {
            author: true,
            likedUsers: true,
            viewedUsers: true,
          },
        },
        followers: true,
        following: true,
        viewedPosts: true,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    return Response.json(user);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
