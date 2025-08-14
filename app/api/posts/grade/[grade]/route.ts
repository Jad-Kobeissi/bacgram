import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ grade: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);
    const { grade } = await params;

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (user?.grade != parseInt(grade))
      return new Response(`You are not in grade ${grade}`, { status: 403 });
    const posts = await prisma.post.findMany({
      where: {
        author: {
          grade: parseInt(grade),
        },
        authorId: {
          not: {
            equals: decoded.id,
          },
        },
      },
      include: {
        author: true,
        viewedUsers: true,
        likedUsers: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      skip: skip,
    });
    if (posts.length == 0)
      return new Response("No Posts Found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
