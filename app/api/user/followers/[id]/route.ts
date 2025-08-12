import { prisma } from "@/app/api/init";
import { verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") as string) || 1;
    const { id } = await params;

    const skip = (page - 1) * 5;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        followers: {
          take: 5,
          skip: skip,
        },
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    if (user.followers.length == 0)
      return new Response("User has no followers", { status: 404 });

    return Response.json(user.followers);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
