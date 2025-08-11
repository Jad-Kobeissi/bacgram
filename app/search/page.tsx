"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Nav from "../Nav";

export default function Search() {
  const user = useRef<HTMLInputElement>(null);
  const router = useRouter();
  return (
    <>
      <Nav />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/results/?q=${user.current?.value}&page=1`);
        }}
        className="flex items-center justify-center flex-col h-screen gap-[3vh]"
      >
        <Input ref={user} placeholder="Username" className="w-fit" />
        <Button className="bg-[var(--custom-blue)]">Search</Button>
      </form>
    </>
  );
}
