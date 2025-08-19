"use client";
import { useGetGames } from "@/lib/queryFunctions";
import { AnimatePresence } from "framer-motion";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import MotionItem from "./defaults/MotionItem";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

const Search = () => {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const { games, isLoading } = useGetGames({ query: search, isDisabled: search === "" });
  const [active, setActive] = useState(false);
  const outsideREF = useRef(null);
  useEffect(() => {
    window.addEventListener("click", (e) => {
      console.log(e.target, outsideREF.current);
      if (outsideREF.current && !outsideREF.current.contains(e.target)) {
        setActive(false);
      }
    });
  });
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(query);
    }, 500);
    return () => clearTimeout(t);
  }, [query]);
  console.log(games);
  return (
    <div
      ref={outsideREF}
      className=" w-full flex relative  group items-center gap-2 justify-between px-4 border border-input  rounded-xl md:w-[40%] bg-main"
    >
      <input
        value={query}
        onChange={(e) => {
          setActive(true);
          setQuery(e.target.value);
        }}
        className="py-2  text-base   w-full bg-transparent text-gray-50  border-none   outline-none active:outline-none ring-0 placeholder:text-gray-400"
      />
      <div className=" flex items-center gap-2">
        <XIcon
          onClick={() => {
            setQuery("");
            setSearch("");
          }}
        />
        <SearchIcon className="w-5 h-5 cursor-pointer  duration-150 group-hover:text-rose-400" />
      </div>
      <AnimatePresence>
        {(games?.data || isLoading) && active && (
          <MotionItem
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ opacity: 0 }}
            className="absolute w-full top-full z-50 bg-[#222425] rounded-2xl shadow-sm max-h-[40vh] overflow-y-scroll left-0"
          >
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 flex items-start gap-2 px-4 py-2">
                  <Skeleton className="h-20  rounded-2xl w-[40%]" />
                  <div className=" flex flex-col gap-3">
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))
            ) : games?.data.results.length > 0 ? (
              games?.data.results.map((game: any) => (
                <div key={game.id} className="hover:bg-rose-600 duration-200 flex flex-col gap-2 px-4 py-2">
                  <Link href={`/game/${game.id}`} className="flex gap-3 items-start w-full h-full">
                    <div className="rounded-2xl relative overflow-hidden w-[40%] bg-neutral-900 h-20">
                      <Image className="object-cover" src={game.background_image || "/"} alt={game.name} fill />
                    </div>
                    <h1 className="font-semibold text-white">{game.name}</h1>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-white py-4">No games found with "{search}" query</p>
            )}
          </MotionItem>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
