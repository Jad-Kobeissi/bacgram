"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from "../contexts/UserContext";
import { Post as TPost } from "../types";
import Error from "../Error";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import Loading from "../Loading";
import Post from "../Post";
import Nav from "../Nav";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const { user } = useContext(UserContext)!;
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [username, setUsername] = useState("")
  const [grade, setGrade] = useState<Number>(0)
  const [bio, setBio] = useState("")
  const modalRef = useRef<HTMLDialogElement>(null);
  const editModalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const openModal = () => {
    modalRef.current?.showModal();
  };
  const closeModal = () => {
    modalRef.current?.close();
  };
  const fetchPosts = async () => {
    axios
      .get(`/api/posts/user?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPosts([...posts, ...res.data]);
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
        console.log(user);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <>
      <Nav />
      <div className="mt-[30vh] mb-[5vh] flex flex-col items-center justify-center gap-4">
        <div className="capitalize text-[2.5rem] font-bold text-center flex md:flex-row flex-col items-center justify-center gap-4">
          <div>
            <div className="flex items-center gap-[1rem]">
              <img
                src={user?.profilePicture as string}
                alt="Profile picture"
                className="md:w-[5vw] md:h-[5vw] h-[10vw] w-[10vw] rounded-full"
              />{" "}
              <h1 className="flex items-center gap-[.5rem]">
                {user?.username}

                <p className="text-white text-[1.3rem] contrast-[.25]">
                  is in grade {user?.grade as number}
                </p>
              </h1>
            </div>
            {user?.bio?.trim() != "" ? (
              <p className="text-[1rem] contrast-[.25]">{user?.bio}</p>
            ) : null}
          </div>
          <div className="gap-[2rem] flex flex-col">
            <Button
              variant={"destructive"}
              className="border-red-600 border hover:bg-transparent transition-all duration-300"
              onClick={openModal}
            >
              Delete Your Account
            </Button>
            <Button
              className="border-[var(--custom-blue)] border hover:bg-transparent transition-all duration-300 bg-[var(--custom-blue)]"
              onClick={() => {
                editModalRef.current?.showModal();
              }}
            >
              Edit Account
            </Button>
          </div>
        </div>
        <div className="text-center flex gap-4">
          <motion.h1
            className="text-[1.2rem] hover:contrast-[0.25] active:contrast-[0.25]"
            onClick={() => router.push(`/followers/${user?.id}`)}
            whileTap={{ scale: 0.9 }}
          >
            Followers: {user?.followers?.length}
          </motion.h1>
          <motion.h1
            className="text-[1.2rem] hover:contrast-[.25] active:contrast-[.25]"
            onClick={() => router.push(`/following/${user?.id}`)}
            whileTap={{ scale: 0.9 }}
          >
            Following: {user?.following?.length}
          </motion.h1>
        </div>
      </div>

      <InfiniteScroll
        next={fetchPosts}
        hasMore={hasMore}
        loader={<Loading className="w-fit h-fit" />}
        dataLength={posts.length}
        endMessage={null}
        className="flex flex-col items-center justify-center gap-[20vh] mb-[5vh]"
      >
        {posts.map((post) => (
          <Post key={post.id as number} post={post} />
        ))}
      </InfiniteScroll>
      {error && <Error className="text-center">{error}</Error>}
      <dialog
        ref={modalRef}
        className="min-w-screen min-h-screen bg-transparent backdrop-blur-md"
      >
        <div className="flex flex-col justify-center items-center h-screen backdrop-blur-md gap-[1rem]">
          <div className="flex items-center flex-col gap-[1rem] bg-[#121212] text-white px-[3rem] py-[4rem] rounded-md">
            <h1 className="text-[1.5rem]">
              Are you sure you want to delete your account?
            </h1>
            <div className="gap-[2rem] flex items-center ">
              <Button
                variant={"destructive"}
                onClick={() => {
                  axios
                    .delete(`/api/user/${user?.id}`, {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    })
                    .then(() => {
                      alert("Post deleted");
                      sessionStorage.clear();
                      deleteCookie("token");
                      localStorage.clear();
                      router.push("/");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                Delete
              </Button>
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        </div>
      </dialog>
      <dialog
        ref={editModalRef}
        className="min-h-screen min-w-screen bg-transparent backdrop-blur-md"
      >
        <div className="flex items-center justify-center flex-col h-screen">
          <div className="bg-[#121212] px-[7rem] py-[4rem] rounded-md flex flex-col gap-[1rem]">
            <h1 className="text-[2rem] text-white">Edit Your Profile</h1>
            <form
              className="flex flex-col items-center justify-center gap-[1rem]"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData();

                formData.append("username", username as string);
                formData.append("grade", grade as any);
                formData.append("bio", bio as string);

                if (
                  username == user?.username &&
                  grade == user?.grade &&
                  bio == user?.bio
                ) {
                  alert("Please Change a value");
                  return;
                }
                axios
                  .put("/api/user", formData, {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  })
                  .then((res) => {
                    alert("Updated!");
                    localStorage.setItem("user", JSON.stringify(res.data));
                    window.location.reload();
                  })
                  .catch((err) => {
                    setError(err.response.data);
                    console.log(err);
                  });
              }}
            >
              <Input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="text-white"
                defaultValue={user?.username as string}
                maxLength={20}
              />
              <Input
                type="text"
                placeholder="Bio"
                onChange={(e) => setBio(e.target.value)}
                className="text-white"
                defaultValue={user?.bio?.trim() as string}
                maxLength={100}
              />
              <Input
                type="number"
                placeholder="Grade"
                defaultValue={user?.grade as number}
                onChange={(e) => setGrade(e.target.value as any)}
                className="text-white"
                max={12}
              />
              <div className="flex items-cemter justify-center gap-[2rem]">
                <Button
                  className="bg-[var(--custom-blue)] border border-[var(--custom-blue)] transition-all duration-200 px-[3rem]"
                  type="submit"
                >
                  Edit
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    editModalRef.current?.close();
                  }}
                  variant={"secondary"}
                  className="px-[3rem]"
                >
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
