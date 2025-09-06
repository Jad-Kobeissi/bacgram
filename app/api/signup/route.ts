import { hash } from "bcrypt";
import { isEmpty } from "../isEmpty";
import { prisma, storage } from "../init";
import { sign } from "jsonwebtoken";
import { getDownloadURL, ref } from "firebase/storage";
import { userAgent } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const grade = parseInt(formData.get("grade")?.toString() as string);
    if (!username || !password || !grade || isEmpty([username, password]))
      return new Response("Bad Request", { status: 400 });

    const userCheck = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userCheck) return new Response("Username Taken", { status: 409 });
    if (grade < 1 || grade > 12)
      return new Response("Invalid Grade", { status: 400 });
    const storageRef = ref(
      storage,
      `${process.env.profilePictureBucket}/profile.png`
    );
    const downloadURL = await getDownloadURL(storageRef);
    const user = await prisma.user.create({
      data: {
        username,
        password: await hash(password, 10),
        profilePicture: downloadURL,
        grade,
      },
      include: {
        posts: true,
        viewedPosts: true,
        followers: true,
        following: true,
        likedPosts: true,
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
