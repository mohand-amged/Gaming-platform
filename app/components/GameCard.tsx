import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { FaPlaystation } from "react-icons/fa";
import { FaXbox } from "react-icons/fa";
import { FaSteam } from "react-icons/fa";
import ImageSwitcher from "./ImageSwitcher";
import MotionItem from "./defaults/MotionItem";
import AddToWishList from "./AddToWishList";

const GameCard = ({ game, wishlist,screenBig=false }: { game: Game; wishlist?: boolean,screenBig:boolean }) => {
  console.log(game);
  return (
    <HoverCard>
      <div className=" flex relative flex-col items-start gap-4">
        <HoverCardTrigger className="relative cursor-pointer  w-full" asChild>
          <div>
            <div className=" relative flex flex-col gap-2">
              <div className="hover:opacity-80 duration-150 w-full overflow-hidden h-64 relative rounded-xl">
                <Image className=" object-cover" src={game.background_image} alt={game.name} fill />
              </div>
              <Link href={`/game/${game.id}`} className=" text-sm line-clamp-1 font-semibold text-white">
                {game.name}
              </Link>
              <div key={game.id} className=" mt-2 flex items-center gap-1">
                {game.parent_platforms.map((platform, i) => (
                  <p key={`platform-${platform.platform.id}-${i}`}>
                    {platform.platform.slug === "pc" ? (
                      <FaSteam />
                    ) : platform.platform.slug.includes("playstation") ? (
                      <FaPlaystation className=" text-blue-500" />
                    ) : platform.platform.slug.includes("xbox") ? (
                      <FaXbox className=" text-green-500" />
                    ) : null}
                  </p>
                ))}
              </div>{" "}
            </div>
          </div>
        </HoverCardTrigger>
        {wishlist && (
          <div className=" absolute left-2 z-10 cursor-pointer top-2">
            <AddToWishList plus gameId={game.id.toString()} />
          </div>
        )}
      </div>
      <HoverCardContent align="center" className="w-full bg-transparent border-none">
        {game.short_screenshots && (
          <ImageSwitcher game={game} images={screenBig ? game.short_screenshots.results : game.short_screenshots} />
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default GameCard;
