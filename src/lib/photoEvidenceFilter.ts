export function filterPhotoEvidence<T extends { suspectTag: string | null }>(
  photos: T[],
  filter: "all" | "untagged" | string
): T[] {
  if (filter === "all") return photos;
  if (filter === "untagged") return photos.filter((photo) => photo.suspectTag === null);
  return photos.filter((photo) => photo.suspectTag === filter);
}
