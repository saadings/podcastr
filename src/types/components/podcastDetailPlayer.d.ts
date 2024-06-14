interface IPodcastDetailPlayerProps {
  audioUrl?: string;
  podcastTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl?: string;
  podcastId: Id<"podcasts">;
  imageStorageId?: Id<"_storage">;
  audioStorageId?: Id<"_storage">;
  authorImageUrl: string;
  authorId: string;
}
