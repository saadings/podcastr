interface ITopPodcastersProps {
  totalPodcasts: number;
  podcast: {
    podcastTitle: string;
    podcastId: Id<"podcasts">;
  }[];
  _id: Id<"users">;
  _creationTime: number;
  name: string;
  imageUrl: string;
  email: string;
  clerkId: string;
}

interface ICarouselProps {
  fanLikeDetails: ITopPodcastersProps[];
}
