import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../init";
import { isEmpty } from "../isEmpty";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);
    const posts = await prisma.post.findMany({
      where: {
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
      include: {
        author: true,
        viewedUsers: true,
        likedUsers: true,
      },
    });
    if (posts.length == 0)
      return new Response("No Posts Found", { status: 404 });

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
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();
    const image = formData.get("image") as File | null;

    if (!title || !content || isEmpty([title, content]))
      return new Response("ALl fields are required", { status: 400 });

    const decoded: any = await decode(authHeader);

    let post;
    if (image) {
      const storageRef = ref(
        storage,
        `${process.env.imageBucket}/${image.name}`
      );
      await uploadBytes(storageRef, image);
      let imageUrl = await getDownloadURL(storageRef);
      post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: decoded.id,
          image: imageUrl,
        },
      });
    } else {
      post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: decoded.id,
        },
      });
    }

    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
