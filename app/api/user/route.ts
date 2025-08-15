import { decode, verify } from "jsonwebtoken";
import { prisma } from "../init";
import { isEmpty } from "../isEmpty";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized ", { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") as string) || 1;

    const decoded: any = decode(authHeader);
    const skip = (page - 1) * 5;
    let users;
    users = await prisma.user.findMany({
      where: {
        username: {
          contains: q as string,
        },
        id: {
          not: {
            equals: decoded.id,
          },
        },
      },
      take: 5,
      skip: skip,
      include: {
        followers: true,
        following: true,
      },
    });
    if (users.length == 0)
      return new Response("No users found", { status: 404 });

    return Response.json(users);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const formData = await req.formData();

    const grade = formData.get("grade");
    const username = formData.get("username");
    const bio = formData.get("bio");

    const decoded: any = decode(authHeader);

    if (grade == "" && username == "" && bio == "")
      return new Response("Please fill out a field", { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (username != null) {
      const userCheck = await prisma.user.findFirst({
        where: {
          username: username as string,
        },
      });

      if (userCheck) return new Response("Username Taken", { status: 400 });
    }
    const newUser = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        grade: grade != "" ? parseInt(grade as string) : user?.grade,
        username: username != "" ? (username as string) : user?.username,
        bio: bio != "" ? (bio as string) : user?.bio,
      },
      include: {
        followers: true,
        following: true,
        likedPosts: true,
        posts: true,
        viewedPosts: true,
      },
    });

    return Response.json(newUser);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
