"use client";
import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";

export type TUserContext = {
  user: User | null;
  setUser: (user: User) => void;
};
export const UserContext = createContext<TUserContext | null>(null);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUserState(JSON.parse(localStorage.getItem("user") as string));
    }
  }, []);
  const setUser = (user: User) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
