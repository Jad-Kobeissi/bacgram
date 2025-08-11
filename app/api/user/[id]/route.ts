import { prisma } from "@/app/api/init";
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: String }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const decoded: any = decode(authHeader);

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id as string),
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    if (decoded.id != user.id)
      return new Response("Unauthorized", { status: 401 });
    await prisma.user.delete({
      where: {
        id: parseInt(id as string),
      },
    });

    return new Response("Post Deleted");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
