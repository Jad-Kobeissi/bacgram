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

    if (!user.followers.some((u) => u.id === decoded.id)) {
      return new Response("You are not following this user", { status: 400 });
    }

    await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        followers: {
          disconnect: { id: decoded.id },
        },
      },
      include: {
        followers: true,
        following: true,
      },
    });
    await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        following: {
          disconnect: { id: parseInt(id) },
        },
      },
    });

    return new Response("Unfollowed Succesfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
