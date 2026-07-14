export function filterPhotoEvidence<T extends { locationTag: string | null }>(
  photos: T[],
  location: string
): T[] {
  return photos.filter((photo) => photo.locationTag === location);
}
