export function filterPhotoEvidence<T extends { locationTag: string | null }>(
  photos: T[],
  location: string
): T[] {
  if (location === "all") return photos;
  return photos.filter((photo) => photo.locationTag === location);
}
