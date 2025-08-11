"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { setCookie } from "cookies-next";
import { UserContext } from "../contexts/UserContext";
import Loading from "../Loading";
import Error from "../Error";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";

export default function Login() {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const { setUser } = useContext(UserContext)!;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return loading ? (
    <Loading className="w-screen h-screen" />
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex md:justify-between justify-center px-[2vw] h-screen"
    >
      <div className="hidden justify-start items-center md:flex">
        <h1 className="text-[4rem] font-bold">Welcome Back!</h1>
      </div>
      <form
        className="flex justify-center flex-col md:pr-[5vw]  gap-[3vh] items-center"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          axios
            .post("/api/login", {
              username: username.current?.value,
              password: password.current?.value,
            })
            .then((res) => {
              localStorage.clear();
              setUser(res.data.user);
              setCookie("token", res.data.token);
              router.push("/home");
            })
            .catch((err) => {
              setError(err.response.data);
              setLoading(false);
            });
        }}
      >
        <h1 className="text-[2rem] text-center font-bold">LogIn</h1>
        {error && <Error>{error}</Error>}
        <Input
          type="text"
          placeholder="Username"
          className="px-[3vw] text-center"
          ref={username}
        />
        <Input
          type="password"
          placeholder="Password"
          className="px-[3vw] text-center"
          ref={password}
        />
        <div className="group relative">
          <Link href="/signup">Dont Have An Account? SignUp Here</Link>
          <span className="w-0 h-0.5 bottom-0 left-0 absolute bg-[#d9d9d9] group-hover:w-full transition-all duration-200"></span>
        </div>
        <Button className="hover:bg-transparent bg-[var(--custom-blue)] border border-[var(--custom-blue)] active:bg-transparent transition-all duration-200 w-fit px-[2vw]">
          LogIn
        </Button>
      </form>
    </motion.div>
  );
}
