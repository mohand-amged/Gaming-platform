import React from "react";
import { getGenres } from "@/app/api/api";
import GridContainer from "@/app/components/defaults/GridContainer";
import Heading from "@/app/components/Heading";
import Link from "next/link";
import Image from "next/image";

const CategoryPage = async () => {
  const genres = await getGenres();

  return (
    <div className="mt-10 flex flex-col gap-6">
      <Heading text="Game Categories" />
      <GridContainer className="gap-6" cols={4}>
        {genres.results.map((genre: { id: number; name: string; games_count: number; description?: string; image_background?: string }) => (
          <Link
            key={genre.id}
            href={`/category/${genre.id}`}
            className="group relative overflow-hidden rounded-2xl bg-main p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              {genre.image_background && (
                <div className="relative h-32 w-full overflow-hidden rounded-xl">
                  <Image
                    src={genre.image_background}
                    alt={genre.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-white">{genre.name}</h3>
                <p className="text-sm text-gray-300">
                  {genre.games_count} games available
                </p>
                {genre.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {genre.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </GridContainer>
    </div>
  );
};

export default CategoryPage;
