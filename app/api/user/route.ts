import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../init";
import { isEmpty } from "../isEmpty";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

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
    const profilePicture = formData.get("profilePicture") as File;
    const decoded: any = decode(authHeader);

    if (grade == "" && username == "" && bio == "" && profilePicture == null)
      return new Response("Please fill out a field", { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return new Response("User not found", { status: 404 });
    console.log(user.username);
    if (username != null) {
      const userCheck = await prisma.user.findFirst({
        where: {
          username: username as string,
        },
      });

      if (userCheck) return new Response("Username Taken", { status: 400 });
    }
    let profilePictureUrl = user?.profilePicture;
    if (profilePicture != null) {
      const profileRef = ref(
        storage,
        `${process.env.profilePictureBucket}/${user.username}`
      );
      uploadBytes(
        ref(storage, `${process.env.profilePictureBucket}/${user.username}`),
        profilePicture
      );

      profilePictureUrl = await getDownloadURL(profileRef);
    }
    const newUser = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        grade: (grade as any) != 0 ? parseInt(grade as string) : user?.grade,
        username:
          username != "" && username != null
            ? (username as string)
            : user?.username,
        bio: bio as string,
        profilePicture: profilePictureUrl as string,
        updatedAt: new Date(),
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
    console.log(error);

    return new Response(error, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = decode(authHeader);

    const id = decoded.id;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id as string),
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    if (decoded.id != user.id)
      return new Response("Unauthorized", { status: 401 });
    await prisma.user.delete({
      where: {
        id: parseInt(id as string),
      },
    });

    const userRef = ref(
      storage,
      `${process.env.profilePictureBucket}/${decoded.username}`
    );

    deleteObject(userRef);

    return new Response("Post Deleted");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
