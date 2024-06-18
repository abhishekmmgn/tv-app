import React from "react";
import { motion } from "framer-motion";

export default function FadeInWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  let parent = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  let stat = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  return (
    <motion.div variants={parent} initial="hidden" animate="show">
      <motion.div variants={stat}>{children}</motion.div>
    </motion.div>
  );
}
