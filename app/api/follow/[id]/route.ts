import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../init";

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

    const decoded: any = decode(authHeader);
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        followers: true,
        following: true,
      },
    });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    if (user.id == decoded.id) {
      return new Response("You cannot follow yourself", { status: 400 });
    }

    if (user.followers.some((u) => u.id === decoded.id)) {
      return new Response("You are already following this user", {
        status: 400,
      });
    }

    await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        followers: {
          connect: { id: decoded.id },
        },
      },
      include: {
        followers: true,
        following: true,
        posts: true,
        likedPosts: true,
        viewedPosts: true,
      },
    });
    await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        following: {
          connect: { id: parseInt(id) },
        },
      },
    });

    return new Response("Followed successfully");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
