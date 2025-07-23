import { ReactNode } from "react";

export default function Error({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1 className={`text-red-500 text-[1.5rem] ${className}`}>{children}</h1>
  );
}
