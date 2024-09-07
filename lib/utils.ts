import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fadeInWrapperParent = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const fadeInWrapperStat = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};
