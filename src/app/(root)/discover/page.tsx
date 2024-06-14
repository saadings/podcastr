"use client";

import { api } from "@/_generated/api";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import SearchBar from "@/components/SearchBar";
import { useQuery } from "convex/react";

const Discover = ({
  searchParams: { search },
}: {
  searchParams: { search: string };
}) => {
  const podcastData = useQuery(api.podcasts.getPodcastBySearch, {
    search: search ?? "",
  });

  return (
    <div className="flex flex-col gap-9">
      <SearchBar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bol text-white-1">
          {search ? (
            <p className="font-bold">
              Search results for
              <span className="font-normal text-orange-1">
                {" "}
                &quot;{search}&quot;
              </span>
            </p>
          ) : (
            "Discover Trending Podcasts"
          )}
        </h1>

        {podcastData ? (
          <>
            {podcastData.length > 0 ? (
              <div className="podcast_grid">
                {podcastData?.map(
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
            ) : (
              <EmptyState title="No podcasts found" />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;
