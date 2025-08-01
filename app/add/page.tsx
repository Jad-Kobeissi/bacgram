"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Nav from "../Nav";
import { useRef, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

export default function Add() {
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Nav />
      <div className="flex items-center md:justify-between justify-center p-[2vw] h-screen">
        <h1 className="text-[3.5rem] font-bold md:flex hidden">
          Start Posting Now!
        </h1>
        <form
          className="flex flex-col gap-4 items-center justify-center md:mr-[4vw]"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            const formData = new FormData();
            formData.append("title", title.current?.value as string);
            formData.append("content", content.current?.value as string);
            if (image.current?.files) {
              formData.append("image", image.current.files[0]);
            }
            axios
              .post("/api/posts", formData, {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              })
              .then(() => {
                alert("Post created successfully!");
              })
              .catch((err) => {
                console.error(err);
              })
              .finally(() => setLoading(false));
          }}
        >
          <h1 className="text-[2.5rem] font-semibold">Post</h1>
          <Input
            placeholder="Title"
            className="px-[3vw] text-center placeholder:text-[1.2rem] text-[1.2rem]"
            ref={title}
          />
          <Input
            placeholder="Content"
            className="px-[3vw] text-center placeholder:text-[1.2rem] text-[1.2rem]"
            ref={content}
          />
          <Input
            placeholder="Image"
            type="file"
            accept="image/*"
            className="px-[3vw] text-center placeholder:text-[1.2rem] text-[1.2rem]"
            ref={image}
          />
          <Button className="bg-[var(--custom-purple)] text-[1.2rem] px-[2vw] border-[var(--custom-purple)] border">
            Post
          </Button>
        </form>
      </div>
    </>
  );
}
