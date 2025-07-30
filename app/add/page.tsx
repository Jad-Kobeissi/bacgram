import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Nav from "../Nav";

export default function Add() {
  return (
    <>
      <Nav />
      <div className="flex items-center md:justify-between justify-center p-[2vw] h-screen">
        <h1 className="text-[3.5rem] font-bold md:flex hidden">
          Start Posting Now!
        </h1>
        <form className="flex flex-col gap-4 items-center justify-center md:mr-[4vw]">
          <h1 className="text-[2.5rem] font-semibold">Post</h1>
          <Input
            placeholder="Title"
            className="px-[3vw] text-center placeholder:text-[1.2rem] text-[1.2rem]"
          />
          <Input
            placeholder="Content"
            className="px-[3vw] text-center placeholder:text-[1.2rem] text-[1.2rem]"
          />
          <Button className="bg-[var(--custom-purple)] text-[1.2rem] px-[2vw] border-[var(--custom-purple)] border">
            Post
          </Button>
        </form>
      </div>
    </>
  );
}
