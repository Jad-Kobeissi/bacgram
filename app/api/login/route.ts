import { compare } from "bcrypt";
import { isEmpty } from "../isEmpty";
import { prisma } from "../init";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password || isEmpty([username, password]))
      return new Response("Username and Password Required", { status: 400 });

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        likedPosts: true,
        viewedPosts: true,
        posts: true,
        followers: true,
        following: true,
      },
    });

    if (!user) return new Response("User Not Found", { status: 404 });

    const isPasswordMatching = await compare(password, user.password);

    if (!isPasswordMatching)
      return new Response("Invalid Password", { status: 400 });

    const token = await sign(
      { username, id: user.id },
      process.env.SECRET as string
    );

    return Response.json({ token, user });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
