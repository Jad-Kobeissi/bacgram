"use client";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ComponentType, FC, ReactElement, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Lock from "./lock-solid-full";
import Plus from "./plus-solid-full";
import Heart from "./heart-solid-full";
import Profile from "./user-solid-full";
function Nav() {
  return (
    <nav className="px-[2rem] py-[.6rem] flex items-center justify-between h-fit gap-[3vw] fixed w-screen text-[var(--custom-white)]">
      <button className="text-[1.5rem] font-bold">Bacgram</button>
      <div className="items-center h-full flex md:gap-[3rem] gap-[2rem]">
        <div className="relative group">
          <Link href={"#home"} className="text-[1.3rem]">
            Home
          </Link>
          <span className="absolute bottom-0 left-0 bg-[#d9d9d9] h-0.5 w-0 group-hover:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"#about"} className="text-[1.3rem]">
            About
          </Link>
          <span className="absolute bottom-0 left-0 bg-[#d9d9d9] h-0.5 w-0 group-hover:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"#features"} className="text-[1.3rem]">
            Features
          </Link>
          <span className="absolute bottom-0 left-0 bg-[#d9d9d9] h-0.5 w-0 group-hover:w-full transition-all duration-200"></span>
        </div>
      </div>
    </nav>
  );
}
function Home() {
  const { ref, inView } = useInView({
    triggerOnce: false,
    delay: 200,
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      ref={ref}
      id="home"
      transition={{ duration: 0.4 }}
      className="px-[5vw] pt-[20vh] font-semibold flex flex-col gap-[3vh] h-screen home"
    >
      <h1 className="md:text-[4.33rem] text-[3.33rem]">Welcome To Bacgram!</h1>
      <p className="md:w-[45vw] w-full">
        <span className="text-[var(--custom-blue)]">Connect</span>,{" "}
        <span className="text-[var(--custom-blue)]">share</span>,{" "}
        <span className="text-[var(--custom-blue)]">stay</span> updated with
        your classmates. Bacgram is THE school's private space moments{" "}
        <span className="text-[var(--custom-blue)]">post</span>,{" "}
        <span className="text-[var(--custom-blue)]">join</span> discussions, and{" "}
        <span className="text-[var(--custom-blue)]">buid</span> lasting
        memories throughout the academic year.
      </p>
      <div className="flex gap-[1.5rem]">
        <button className="bg-[var(--custom-blue)] border border-[var(--custom-blue)] hover:bg-transparent focus:bg-transparent active:bg-transparent text-[1.5rem] w-[8.5rem] h-[2.5rem] transition-colors duration-300 rounded-md flex items-center justify-center font-semibold">
          LogIn
        </button>
        <h1 className="text-[1.5rem] font-bold">OR</h1>
        <button className="bg-[var(--custom-gray)] hover:bg-transparent active:bg-transparent focus:bg-transparent text-[1.5rem] w-[8.5rem] h-[2.5rem] border border-[var(--custom-gray)] transition-colors duration-300 rounded-md flex items-center justify-center font-semibold">
          SignUp
        </button>
      </div>
    </motion.div>
  );
}
function About() {
  const { ref, inView } = useInView({
    triggerOnce: false,
    delay: 1000,
  });
  return (
    <div
      id="about"
      ref={ref}
      className="flex items-center justify-center flex-col text-center gap-[3vh] bg-[#181818] min-h-screen text-[var(--custom-white)]"
    >
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
        className="text-[2.5rem] font-bold text-center text-[var(--custom-white)]"
      >
        What Is Bacgram?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
        className="md:w-[50vw] text-[1.2rem] w-screen"
      >
        <span className="text-[var(--custom-blue)]">Bacgram</span> is a social
        platform designed exclusively for students at BAC,n It allows users to{" "}
        <span className="text-[var(--custom-blue)]">share posts</span>, and{" "}
        <span className="text-[var(--custom-blue)]">stay connected</span>{" "}
        through a familiar, secure interface. Whether you're documenting school
        events, starting conversations, or just keeping in touch, Bacgram helps
        bring our student community closer together.
      </motion.p>
    </div>
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
      className="bg-[#1e1e1e] px-[2vw] py-[3vh] text-left flex flex-col rounded-md"
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
  const { ref, inView } = useInView({
    triggerOnce: true,
    delay: 1,
  });
  return (
    <div
      className="bg-[#1f1f1f] pt-[10vh] text-[var(--custom-white)] min-h-screen h-fit py-[10vh] w-screen"
      id="features"
    >
      <h1 className="text-center text-[3.5rem] font-bold">Features</h1>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        ref={ref}
        className="grid md:grid-cols-2 grid-cols-1 place-items-center w-screen gap-4"
      >
        <Card
          Svg={Lock}
          title={"Security"}
          text={
            "Highest security to ensure that your web experience remains secure at all times"
          }
        />
        <Card
          Svg={Plus}
          title={"Post Creation"}
          text={"Users can create posts, with an image option being available"}
        />
        <Card
          Svg={Heart}
          title="Likes"
          text="Users can like posts to engage wuth the creator"
        />
        <Card
          Svg={Profile}
          title="Profile"
          text="User profiles are availablr with username, grade and followers"
        />
      </motion.div>
    </div>
  );
}
function Contact() {
  return (
    <div
      id="contact"
      className="p-[2vw] bg-[#131313] h-fit text-[var(--custom-white)]"
    >
      <div className="relative group w-fit">
        <Link
          href={"mailto:jadkoneissi@gmail.com"}
          className="flex items-center gap-[1vw]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className="w-[2rem] fill-[var(--custom-white)]"
          >
            <path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z" />
          </svg>
          <h1>jadkoneissi@gmail.com</h1>
        </Link>
      </div>
      <div className="relative group w-fit">
        <Link href={"tel:81195890"} className="flex items-center gap-[1vw]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className="fill-[var(--custom-white)] w-[2rem]"
          >
            <path d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z" />
          </svg>
          <h1>+96181195890</h1>
        </Link>
      </div>
    </div>
  );
}
export default function Main() {
  const router = useRouter();
  useEffect(() => {
    if (getCookie("token")) {
      router.push("/home");
    }
  }, []);
  return (
    <>
      <Nav />
      <Home />
      <About />
      <Features />
      <Contact />
    </>
  );
}
