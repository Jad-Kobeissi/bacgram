"use client";
import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between p-4 fixed w-screen top-0 z-50]">
      <Button
        variant={"ghost"}
        className="text-[1.3rem] font-semibold"
        onClick={() => router.push("/home")}
      >
        Bacgram
      </Button>
      <div className="flex items-center gap-[3vw]">
        <div className="relative group">
          <Link href={"/home"}>Home</Link>
          <span className="w-0 h-0.5 bg-[#d9d9d9] left-0 bottom-0 absolute group-hover:w-full group-active:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"/add"}>Add</Link>
          <span className="w-0 h-0.5 bg-[#d9d9d9] left-0 bottom-0 absolute group-hover:w-full transition-all group-active:w-full duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"/profile"}>Profile</Link>
          <span className="w-0 h-0.5 bg-[#d9d9d9] left-0 bottom-0 absolute group-hover:w-full transition-all duration-200 group-active:w-full"></span>
        </div>
        <div className="relative group">
          <button
            className="w-fit h-fit"
            onClick={() => {
              deleteCookie("token");
              sessionStorage.clear();
              localStorage.clear();
              router.push("/");
            }}
          >
            LogOut
          </button>
          <span className="w-0 h-0.5 bg-[#d9d9d9] left-0 bottom-0 absolute group-hover:w-full transition-all duration-200 group-active:w-full"></span>
        </div>
      </div>
    </nav>
  );
}
