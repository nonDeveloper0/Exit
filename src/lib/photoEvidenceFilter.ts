export function filterPhotoEvidence<T extends { locationTag: string | null }>(
  photos: T[],
  location: string
): T[] {
  return photos.filter((photo) => photo.locationTag === location);
}

export function isCountedPhotoEvidence(photo: { status: string | null | undefined }) {
  return photo.status !== "rejected";
}
