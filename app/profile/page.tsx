"use client";
import { useContext, useEffect, useRef, useState } from "react";
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

export default function Profile() {
  const { user } = useContext(UserContext)!;
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const modalRef = useRef<HTMLDialogElement>(null);
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
  return (
    <>
      <Nav />
      <div className="mt-[30vh] mb-[5vh] flex flex-col items-center justify-center gap-4">
        <div className="capitalize text-[2.5rem] font-bold text-center flex items-center justify-center gap-4">
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
          <Button variant={"destructive"} onClick={openModal}>
            Delete Your Account
          </Button>
        </div>
        <div className="text-center flex gap-4">
          <h1 className="text-[1.2rem]">
            Followers: {user?.followers?.length}
          </h1>
          <h1 className="text-[1.2rem]">
            Following: {user?.following?.length}
          </h1>
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
    </>
  );
}
