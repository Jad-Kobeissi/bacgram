import { hash } from "bcrypt";
import { isEmpty } from "../isEmpty";
import { prisma } from "../prisma";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password || isEmpty([username, password]))
      return new Response("Username and Password", { status: 400 });

    const userCheck = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userCheck) return new Response("Username Taken", { status: 409 });

    const user = await prisma.user.create({
      data: {
        username,
        password: await hash(password, 10),
      },
      include: {
        posts: true,
        viewedPosts: true,
      },
    });

    const token = await sign(
      { username, id: user.id },
      process.env.SECRET as string
    );

    return Response.json({ token, user });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
