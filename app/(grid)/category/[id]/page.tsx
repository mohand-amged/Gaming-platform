import React from "react";
import { getGenreById, getGamesByGenre } from "@/app/api/api";
import { Game } from "@/app/types";
import GridContainer from "@/app/components/defaults/GridContainer";
import Heading from "@/app/components/Heading";
import GameCard from "@/app/components/GameCard";

import Empty from "@/app/components/defaults/Empty";
import { PaginationCustom } from "@/app/components/PaginationCustom";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { id } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page);

  try {
    const [genre, gamesData] = await Promise.all([
      getGenreById(id),
      getGamesByGenre(id, currentPage, 20)
    ]);

    const totalPages = Math.ceil(gamesData.count / 20);

    return (
      <div className="mt-10 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Heading text={genre.name} />
          {genre.description && (
            <p className="text-gray-300 max-w-3xl">{genre.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{gamesData.count} games available</span>
            {genre.games_count && (
              <span>• {genre.games_count} total games in this category</span>
            )}
          </div>
        </div>

        <GridContainer className="gap-5" cols={4}>
          {gamesData.results.length > 0 ? (
            gamesData.results.map((game: Game) => (
              <GameCard
                key={game.id}
                game={game}
                wishlist
                screenBig={false}
              />
            ))
          ) : (
            <Empty message="No games found in this category" />
          )}
        </GridContainer>

        {totalPages > 1 && (
          <PaginationCustom
            page={currentPage}
            count={totalPages}
            setPage={(newPage) => {
              const url = new URL(window.location.href);
              url.searchParams.set("page", newPage.toString());
              window.location.href = url.toString();
            }}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading category:", error);
    notFound();
  }
};

export default CategoryPage;
