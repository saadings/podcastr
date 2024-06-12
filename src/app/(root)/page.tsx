"use client";
import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import { useQuery } from "convex/react";
import { api } from "@/_generated/api";

const Home = () => {
  // const tasks = useQuery(api.tasks.get);
  return (
    <div className="flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcast</h1>

        {/* <div className="flex min-h-screen flex-col items-center justify-between p-24 text-white-1">
          {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
        </div> */}

        <div className="podcast_grid">
          {podcastData.map(({ id, imgURL, description, title }) => (
            <PodcastCard
              key={id}
              id={id}
              imgURL={imgURL}
              description={description}
              title={title}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
