"use client";
import React, { useState } from "react";
import GridContainer from "@/app/components/defaults/GridContainer";
import { useGetGames } from "@/lib/queryFunctions";
import GameSkeleton from "./GameSkeleton";
import GameCard from "./GameCard";
import Empty from "./defaults/Empty";
import { PaginationCustom } from "./PaginationCustom";

const Filters = ({ generes }: { generes: any[] }) => {
  const [page, setPage] = useState(1);
  const [activeGenres, setActiveGenres] = useState<number[]>([]);
  const { games, isLoading } = useGetGames({
    page,
    filters: activeGenres.length > 0 ? [{ filterName: "genres", option: activeGenres?.join(",") }] : [],
  });
  const totalPages = Math.ceil(games?.data.count / 21);
  return (
    <GridContainer className=" gap-5 relative" cols={11}>
      <div className="  lg:sticky lg:h-screen  inset-0 col-span-full lg:col-span-2">
        <div className=" flex  flex-row flex-wrap lg:flex-col gap-3 bg-main py-4 px-8 rounded-2xl ">
          {generes.map((genre: any, i: number) => (
            <button
              onClick={() => {
                activeGenres.includes(genre.id)
                  ? setActiveGenres(activeGenres.filter((id) => id !== genre.id))
                  : setActiveGenres([...activeGenres, genre.id]);
              }}
              className={`${activeGenres.includes(genre.id) ? "bg-rose-400" : ""}  text-base   rounded-xl`}
              key={i}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      <GridContainer cols={3} className="  gap-3 col-span-9">
        {isLoading ? (
          <GameSkeleton number={21} />
        ) : games?.data.results.length > 0 ? (
          games?.data.results.map((game: Game) => <GameCard screenBig={false} wishlist key={game.id} game={game} />)
        ) : (
          <Empty message="Sorry, no games found in this page" />
        )}
      </GridContainer>

      <PaginationCustom setPage={setPage} page={page} count={totalPages} />
    </GridContainer>
  );
};

export default Filters;
