import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { PrismaClient } from "@/lib/generated/prisma/client";

export const prisma = new PrismaClient();

export const app = initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
});

export const storage = getStorage(app);
