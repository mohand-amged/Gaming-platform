"use client";
import Image from "next/image";
import React, { useEffect } from "react";

import { motion } from "framer-motion";
import { GoPeople } from "react-icons/go";
const ImageSwitcher = ({ images, game }: { images: any[]; game: Game }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((a) => (a + 1) % images?.length);
    }, 1000);
    return () => clearInterval(t);
  }, [game, images?.length]);
  console.log(activeIndex);

  return (
    <div className=" flex flex-col gap-4 py-3 items-center px-6 rounded-xl bg-main  overflow-hidden">
      <div className=" flex  items-center gap-2 justify-between">
        <h1 className=" text-base text-white">{game.name}</h1>
        <p className=" text-xs text-muted-foreground mt-1">Released {game.released}</p>
      </div>
      <div className=" w-80 h-36 rounded-xl overflow-hidden relative ">
        {images?.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            animate={{ opacity: activeIndex === index ? 1 : 0 }}
            className=" absolute inset-0"
            style={{ zIndex: activeIndex === index ? 1 : 0 }}
          >
            <Image fill src={image.image} alt={`${image}`} className=" object-cover" />
          </motion.div>
        ))}
      </div>
      <p className=" text-sm flex items-center gap-2  self-start text-muted-foreground mt-1">
        <GoPeople />
        Review count {game.reviews_count}
      </p>
    </div>
  );
};

export default ImageSwitcher;
