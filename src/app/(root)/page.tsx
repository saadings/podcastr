"use client";
import PodcastCard from "@/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "@/_generated/api";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

  return (
    <div className="flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcast</h1>

        <div className="podcast_grid">
          {trendingPodcasts?.map(
            ({ _id, imageUrl, podcastDescription, podcastTitle }) => (
              <PodcastCard
                key={_id}
                id={_id}
                title={podcastTitle}
                imgURL={imageUrl!}
                description={podcastDescription}
              />
            ),
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
