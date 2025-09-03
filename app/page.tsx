"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import Lock from "./lock-solid-full";
import { ComponentType } from "react";
import Heart from "./heart-solid-full";
import Plus from "./plus-solid-full";
import Profile from "./user-solid-full";
import { useRouter } from "next/navigation"
function Nav() {
  return (
    <nav className="w-[100%] flex items-center justify-between p-[1rem] fixed z-50 bg-[#121212]">
      <button className="text-[1.5rem]">Bacgram</button>
      <div className="flex items-center justify-center gap-[2vw]">
        <div className="group relative">
          <Link href="#home" className="text-[1.3rem]">
            Home
          </Link>
          <span className="w-0 h-0.5 bg-[#d9d9d9] group-hover:w-full group-focus:w-full group-active:w-full absolute bottom-0 left-0 transition-all duration-200" />
        </div>
        <div className="group relative">
          <Link href="#about" className="text-[1.3rem]">
            About
          </Link>
          <span className="w-0 h-0.5 bg-[#d9d9d9] group-hover:w-full group-focus:w-full group-active:w-full absolute bottom-0 left-0 transition-all duration-200" />
        </div>
        <div className="group relative">
          <Link href="#features" className="text-[1.3rem]">
            Features
          </Link>
          <span className="w-0 h-0.5 bg-[#d9d9d9] group-hover:w-full group-focus:w-full group-active:w-full absolute bottom-0 left-0 transition-all duration-200" />
        </div>
        <Button className="md:flex hidden bg-[#2424244D] text-[1.3rem]">
          LogIn
        </Button>
      </div>
    </nav>
  );
}
function Home() {
  const { ref, inView } = useInView({
    delay: 800,
    triggerOnce: false,
  });
  const router = useRouter()
  return (
    <motion.div
      className="w-full min-h-screen flex md:flex-row flex-col-reverse items-center text-center md:text-left md:justify-between pt-[10vh] md:px-[2rem]"
      initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "none" } : {}}
      ref={ref}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="md:mt-[0] mt-[5vh] flex flex-col gap-[2vh]">
          <h1 className="md:text-[4rem] text-[2.2rem] font-extrabold">
            Welcome To Bacgram!
          </h1>
          <p className="md:max-w-[34rem] md:text-left text-center">
            <span className="text-[var(--custom-blue)]">Connect</span>, 
            <span className="text-[var(--custom-blue)]">share</span>
            , stay updated with your classmates. Bacgram is THE school's private
            space moments 
            <span className="text-[var(--custom-blue)]">post</span>, 
            <span className="text-[var(--custom-blue)]">join</span>
             discussions, and
            <span className="text-[var(--custom-blue)]"> build </span>lasting
            memories throughout the academic year.
          </p>
        </div>
        <div className="mt-[2rem] text-[1.5rem] flex gap-[2rem]">
          <Button
            onClick={() => router.push("/signup")}
            className="bg-[var(--custom-blue)] hover:bg-transparent border border-[var(--custom-blue)]"
          >
            Get Started
          </Button>
          <h1 className="text-[1.5rem] font-bold">OR</h1>
          <Button
            onClick={() => router.push("/login")}
            className="bg-[#2424244D] hover:bg-transparent border border-[#2424244D]"
          >
            LogIn
          </Button>
        </div>
      </div>
      <img
        src="/bac.png"
        className="w-[30rem] md:h-[30rem] h-[20rem] aspect-square rounded-[2rem]"
      />
    </motion.div>
  );
}
function About() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    delay: 800,
  });
  return (
    <motion.div
      className="text-left ml-[2rem] flex flex-col mt-[20vh] mb-[20vh] max-w-screen"
      initial={{ opacity: 0, y: 100, filter: "blur(60px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "none" } : {}}
      ref={ref}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-[4rem] font-extrabold whitespace-nowrap">
        What Is Bacgram?
      </h1>
      <p className="text-[1.3rem]">
        <span className="text-[var(--custom-blue)]">Bacgram</span> is a social
        platform designed exclusively for students at BAC, it allows users to {" "}
        <span className="text-[var(--custom-blue)]">share posts</span>, and{" "}
        <span>stay connected</span> through a familiar, secure interface.
        Whether you're documenting school events, starting conversations, or
        just keeping in touch, Bacgram helps bring our student community closer
        together.
      </p>
    </motion.div>
  );
}
function Card({
  Svg,
  title,
  text,
}: {
  Svg: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  const { ref, inView } = useInView({
    delay: 500,
  });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="bg-[#1e1e1e] px-[2vw] py-[3vh] text-left flex flex-col rounded-md w-fit"
    >
      <div className="flex w-full justify-center">
        <Svg className="w-[5rem] fill-[#e0e0e0]" />
      </div>
      <h1 className="text-[2rem] font-bold">{title}</h1>
      <p className="w-[17rem] contrast-75">{text}</p>
    </motion.div>
  );
}
function Features() {
  return (
    <div className="pt-[10vh] text-[var(--custom-white)] min-h-screen h-fit py-[10vh]">
      <h1 className="text-center text-[4rem] font-bold">Features</h1>
      <div className="grid grid-cols-2 place-items-center gap-[2rem]">
        <Card
          title="Security"
          text="Highest security to ensure that your web experience remains secure at all times"
          Svg={Lock}
        />
        <Card
          title="Likes"
          text="Users can like posts to engage wuth the creator"
          Svg={Heart}
        />
        <Card
          title="Post Creation"
          text="Users can create posts, with an image option being available"
          Svg={Plus}
        />
        <Card
          title="Profile"
          text="User profiles are availablr with username, grade and followers"
          Svg={Profile}
        />
      </div>
    </div>
  );
}
export default function App() {
  return (
    <>
      <Nav />
      <Home />
      <About />
      <Features />
    </>
  );
}
