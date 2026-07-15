export const MAX_PHOTOS_PER_GROUP = 30;

export function hasReachedPhotoLimit(photoCount: number) {
  return photoCount >= MAX_PHOTOS_PER_GROUP;
}

export function remainingPhotoSlots(photoCount: number) {
  return Math.max(0, MAX_PHOTOS_PER_GROUP - photoCount);
}
