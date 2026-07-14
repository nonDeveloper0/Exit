"use client";

export async function compressImage(
  file: File,
  maxSize = 2048,
  quality = 0.9
): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  let { width, height } = bitmap;

  if (width >= height && width > maxSize) {
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  } else if (height > width && height > maxSize) {
    width = Math.round((width * maxSize) / height);
    height = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 컨텍스트를 만들 수 없습니다.");

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 압축 실패"))),
      "image/jpeg",
      quality
    )
  );
}
