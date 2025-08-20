"use client";
import React from "react";
import { motion } from "framer-motion";

const MotionItem = ({
  children,
  className,
  initial,
  animate,
  whileInView,
  exit,
}: {
  children: React.ReactNode;
  className?: string;
  initial?: Parameters<typeof motion.div>[0]["initial"];
  animate?: Parameters<typeof motion.div>[0]["animate"];
  whileInView?: Parameters<typeof motion.div>[0]["whileInView"];
  exit?: Parameters<typeof motion.div>[0]["exit"];
}) => {
  return (
    <motion.div
      initial={initial}
      exit={exit}
      animate={animate}
      whileInView={whileInView}
      className={`${className || ""}`}
    >
      {children}
    </motion.div>
  );
};

export default MotionItem;
