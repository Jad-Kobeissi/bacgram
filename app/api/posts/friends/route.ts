import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../init";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = decode(authHeader);

    const posts = await prisma.post.findMany({
      where: {
        author: {
          followers: {
            some: {
              id: decoded.id,
            },
          },
          following: {
            some: {
              id: decoded.id,
            },
          },
        },
        viewedUsers: {
          none: {
            id: decoded.id,
          },
        },
        authorId: {
          not: {
            equals: decoded.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        likedUsers: true,
        viewedUsers: true,
      },
    });

    console.log(posts);

    if (posts.length == 0)
      return new Response("Posts not found", { status: 404 });

    posts.map(async (post) => {
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          viewedUsers: {
            connect: {
              id: decoded.id,
            },
          },
        },
      });
    });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
