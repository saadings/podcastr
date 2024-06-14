"use client";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Carousel from "../Carousel/Carousel";
import Header from "../Header";
import { useQuery } from "convex/react";
import { api } from "@/_generated/api";
import { useRouter } from "next/navigation";
import LoaderSpinner from "../LoaderSpinner";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";

const RightSidebar = () => {
  const router = useRouter();
  const { user } = useUser();
  const { audio } = useAudio();

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);

  if (!topPodcasters) return <LoaderSpinner />;

  const displayWordPodcast = (podcastCount: number) => {
    return podcastCount > 1 ? "Podcasts" : "Podcast";
  };

  return (
    <section
      className={cn("right_sidebar h-[calc(100vh-5px)] text-white-1", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />

          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h1>

            <Image
              src={"/icons/right-arrow.svg"}
              alt="right arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>

      <section className="space-y-4">
        <Header headerTitle={"Fans Like You"} />
        <Carousel fanLikeDetails={topPodcasters!} />
      </section>

      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle={"Top Podcasters"} />

        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 5).map((podcaster) => (
            <div
              key={podcaster._id}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={podcaster.imageUrl}
                  alt="podaster name"
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />

                <h2 className="text-14 font-semibold text-white-1">
                  {podcaster.name}
                </h2>
              </figure>

              <div className="flex items-center">
                <p className="text-12 font-normal">
                  {podcaster.totalPodcasts}{" "}
                  {displayWordPodcast(podcaster.totalPodcasts)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default RightSidebar;
