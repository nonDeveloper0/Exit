"use client";

export async function compressImage(
  file: File,
  maxSize = 2048,
  quality = 0.9
): Promise<Blob> {
  const { width: naturalWidth, height: naturalHeight } = await getImageDimensions(file);

  let width = naturalWidth;
  let height = naturalHeight;
  if (width >= height && width > maxSize) {
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  } else if (height > width && height > maxSize) {
    width = Math.round((width * maxSize) / height);
    height = maxSize;
  }

  // resizeWidth/resizeHeight를 주면 브라우저가 원본 해상도로 전체 디코딩하지 않고
  // 축소본을 바로 디코딩한다. 고화소 카메라 사진에서 모바일 크롬이 메모리 부족으로
  // 죽는 것을 막기 위한 조치.
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
    resizeWidth: width,
    resizeHeight: height,
    resizeQuality: "medium",
  });

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

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지 크기를 확인할 수 없습니다."));
    };
    img.src = url;
  });
}
