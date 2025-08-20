"use client";
import React, { useState } from "react";
import { useGetGames } from "@/lib/queryFunctions";
import GridContainer from "@/app/components/defaults/GridContainer";
import Heading from "@/app/components/Heading";
import GameCard from "@/app/components/GameCard";
import GameSkeleton from "@/app/components/GameSkeleton";
import Empty from "@/app/components/defaults/Empty";
import { PaginationCustom } from "@/app/components/PaginationCustom";
import Search from "@/app/components/Search";
import { Game } from "@/app/types";

const GamesPage = () => {
  const [page, setPage] = useState(1);
  const { games, isLoading } = useGetGames({
    query: "",
    page,
    pageSize: 20,
    isDisabled: false,
  });

  const totalPages = Math.ceil((games?.data?.count || 0) / 20);

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Heading text="All Games" />
        <div className="flex justify-between items-center">
          <p className="text-gray-400">
            {games?.data?.count || 0} games available
          </p>
          <Search />
        </div>
      </div>

      <GridContainer className="gap-5" cols={4}>
        {isLoading ? (
          <GameSkeleton number={20} />
        ) : games?.data?.results && games.data.results.length > 0 ? (
          games.data.results.map((game: Game) => (
            <GameCard
              key={game.id}
              game={game}
              wishlist
              screenBig={false}
            />
          ))
        ) : (
          <Empty message="No games found" />
        )}
      </GridContainer>

      {totalPages > 1 && (
        <PaginationCustom
          page={page}
          count={totalPages}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default GamesPage;
