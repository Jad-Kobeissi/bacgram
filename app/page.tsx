"use client";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
function Nav() {
  return (
    <nav className="flex items-center justify-between fixed w-screen px-[2vw] py-[2vh]">
      <div>
        <Button className="text-[1.5rem]">Bacgram</Button>
      </div>
      <div className="flex items-center justify-center gap-[3vw]">
        <div className="relative group">
          <Link href={"#home"} className="text-[1.2rem]">
            Home
          </Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-[#d9d9d9] group-hover:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"#about"} className="text-[1.2rem]">
            About
          </Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-[#d9d9d9] group-hover:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"#contact"} className="text-[1.2rem]">
            Contact
          </Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-[#d9d9d9] group-hover:w-full transition-all duration-200"></span>
        </div>
      </div>
    </nav>
  );
}
function Home() {
  const { ref, inView } = useInView({
    triggerOnce: false,
    delay: 500,
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
      ref={ref}
      id="home"
      className="flex items-center justify-center flex-col text-center gap-[3vh] pt-[10vh]"
    >
      <h1 className="text-[var(--custom-white)] text-[2.5rem] text-center mt-[10vh] font-bold">
        Socialize WithIn Your School
      </h1>
      <p className="md:w-[48vw] text-[1.2rem] w-screen">
        <span className="text-[var(--custom-purple)]">Connect, share</span>, and{" "}
        <span className="text-[var(--custom-purple)]">stay updated</span> with
        your classmates. Bacgram is THE school's private space to{" "}
        <span className="text-[var(--custom-purple)]">
          post moments, join discussions,
        </span>{" "}
        and build{" "}
        <span className="text-[var(--custom-purple)]">lasting memories</span>{" "}
        throughout the academic year.
      </p>
      <motion.a
        href="/login"
        className="bg-[var(--custom-purple)] flex h-fit items-center w-fit text-[1.3rem] px-[1vw] rounded-md font-bold gap-[.5vw]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          className="fill-[var(--custom-white)] w-[1.3rem] h-fit"
        >
          <path d="M192 384L88.5 384C63.6 384 48.3 356.9 61.1 335.5L114 247.3C122.7 232.8 138.3 224 155.2 224L250.2 224C326.3 95.1 439.8 88.6 515.7 99.7C528.5 101.6 538.5 111.6 540.3 124.3C551.4 200.2 544.9 313.7 416 389.8L416 484.8C416 501.7 407.2 517.3 392.7 526L304.5 578.9C283.2 591.7 256 576.3 256 551.5L256 448C256 412.7 227.3 384 192 384L191.9 384zM464 224C464 197.5 442.5 176 416 176C389.5 176 368 197.5 368 224C368 250.5 389.5 272 416 272C442.5 272 464 250.5 464 224z" />
        </svg>{" "}
        Get Started
      </motion.a>
    </motion.div>
  );
}
function About() {
  const { ref, inView } = useInView({
    triggerOnce: false,
    delay: 500,
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
      id="about"
      ref={ref}
      className="flex items-center justify-center flex-col text-center gap-[3vh] mt-[50vh] mb-[30vh]"
    >
      <h1 className="text-[2.5rem] font-bold text-center text-[var(--custom-white)]">
        What Is Bacgram?
      </h1>
      <p className="md:w-[48vw] text-[1.2rem] w-screen">
        <span className="text-[var(--custom-purple)]">Bacgram</span> is a social
        platform designed exclusively for students at BAC,n It allows users to{" "}
        <span className="text-[var(--custom-purple)]">share posts</span>, and{" "}
        <span className="text-[var(--custom-purple)]">stay connected</span>{" "}
        through a familiar, secure interface. Whether you're documenting school
        events, starting conversations, or just keeping in touch, Bacgram helps
        bring our student community closer together.
      </p>
    </motion.div>
  );
}
function Contact() {
  return (
    <div id="contact" className="p-[2vw] mb-[5vw]">
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
        <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-[var(--custom-white)] group-hover:w-full transition-all duration-200"></span>
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
        <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-[var(--custom-white)] group-hover:w-full transition-all duration-200"></span>
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
      <Contact />
    </>
  );
}
