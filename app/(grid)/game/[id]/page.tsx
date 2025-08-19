import { getGame } from "@/app/api/api";
import GamesSlider from "@/app/components/GamesSlider";
import SwiperCards from "@/app/components/SwiperCards";
import Image from "next/image";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const game = await getGame(id);
  console.log(game);
  const { screenshots, data, similar }: { screenshots: any[]; data: Game; similar: any[] } = game;
  console.log(data.ratings);
  return (
    <div className=" mt-10">
      <div>
        <div className=" col-span-4 flex flex-col gap-2">
          <h1 className=" text-2xl text-white">{data.name}</h1>
          <div>Rating count : {data.ratings_count}</div>
          <SwiperCards
            slidesPerView={1}
            className=" h-full"
            items={[...screenshots.results, data.background_image, data.background_image_additional].map(
              (screenshot) => {
                return {
                  card: (
                    <div className=" rounded-xl overflow-hidden h-[36rem] w-full relative">
                      <Image src={screenshot.image || screenshot} alt={data.name} fill className=" object-cover" />
                    </div>
                  ),
                  src: screenshot.image || screenshot,
                };
              }
            )}
            paginationImages
          />
          <p className=" mt-10 col-span-2">{data.description_raw}</p>
        </div>
      </div>{" "}
      <GamesSlider title="Similar Games" games={similar.results} />
      {/* <div>
        {data.ratings.map(({ title, count, percent, id }) => (
          <div key={id} className="flex items-center gap-2 mb-4">
            {imageSrc && <img src={imageSrc} alt={title} className="w-8 h-8" />}
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p>
                {count} reviews - {percent}%
              </p>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default page;

/*
you learned 
crud operations (wishlist)
authentication
authorization and protection
setting cookies , delete cookies , mutate them 
frontend optimization debouncing 
fetching data from server page 
server actions 
tanstak query caching 
sliders with animations framer motion
resusability 
filtring 
searching 
middlware
connecting with database 
handling forms and its submission
creating mongoose models and connecting with data base
handling file uploads with cloudinary 
setting up custom hooks 
sync local storage with state 

rest :
review a game
wishlist in single game page 

reply 
*/
