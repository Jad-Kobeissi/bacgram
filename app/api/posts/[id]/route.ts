import { verify } from "jsonwebtoken";
import { prisma } from "../../init";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!verify(authHeader as string, process.env.SECRET as string)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    if (!id) return new Response("Post ID is required", { status: 400 });
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        author: true,
        viewedUsers: true,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
