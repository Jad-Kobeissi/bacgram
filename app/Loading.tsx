import { motion } from "motion/react";
export default function Loading() {
  return (
    <motion.div
      animate={{ scale: [0.9, 1, 0.9] }}
      transition={{ repeat: Infinity, repeatType: "loop" }}
      className="flex items-center justify-center h-screen w-screen"
    >
      Loading...
    </motion.div>
  );
}
