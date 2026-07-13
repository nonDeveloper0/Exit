"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PHOTO_TAGS, photoTagLabel } from "@/lib/data";
import { usePhotoEvidence } from "@/lib/usePhotoEvidence";

export default function EvidencePage() {
  const { photos, loading, uploading, uploadPhoto, ownTeamId } = usePhotoEvidence();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [suspectTag, setSuspectTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setCaption("");
    setSuspectTag("");
    setError(null);
  }

  function closeSheet() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setCaption("");
    setSuspectTag("");
    setError(null);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setError(null);
    try {
      await uploadPhoto(selectedFile, caption, suspectTag);
      closeSheet();
    } catch {
      setError("업로드 실패. 네트워크 상태를 확인하고 다시 시도하세요.");
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          Evidence Vault
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">증거 보관함</h1>
        <p className="text-sm text-zinc-500">
          {ownTeamId ? `${ownTeamId}조 폴라로이드 ${photos.length}장` : "조 정보를 찾을 수 없습니다"}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={!ownTeamId}
        className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 p-5 text-amber-200 transition-colors active:scale-[0.99] disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-8 w-8 stroke-2">
          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
          <circle cx="12" cy="13.5" r="4" />
        </svg>
        <span className="text-base font-bold">현장 증거 촬영</span>
      </button>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="aspect-[3/4] animate-pulse rounded bg-zinc-900" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">아직 촬영한 증거가 없습니다.</p>
          <p className="mt-1 text-xs text-zinc-600">현장을 사진으로 남기세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => {
            const tagLabel = photoTagLabel(photo.suspectTag);
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightbox(photo.imageUrl)}
                className={`relative rotate-[-0.5deg] bg-zinc-100 p-2 pb-4 text-left shadow-lg transition-transform active:scale-[0.98] even:rotate-[0.7deg] ${
                  photo.status === "rejected" ? "opacity-45 grayscale" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt={photo.caption ?? "촬영 증거"}
                  className="aspect-square w-full bg-zinc-300 object-cover"
                  loading="lazy"
                />
                {photo.status === "rejected" && (
                  <span className="absolute left-3 top-3 rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white">
                    제외됨
                  </span>
                )}
                <div className="mt-2 min-h-10 space-y-1">
                  <p className="font-hand text-center text-sm leading-tight text-zinc-900">
                    {photo.caption || "— 기록 없음 —"}
                  </p>
                  {tagLabel && (
                    <span className="mx-auto block w-fit rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                      {tagLabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-3">
          <div className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-4 shadow-2xl">
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="업로드 미리보기"
                className="max-h-[42vh] w-full rounded bg-zinc-900 object-contain"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="caption" className="text-xs font-mono text-zinc-500">
                    캡션
                  </label>
                  <span className="text-xs font-mono text-zinc-600">{caption.length}/20</span>
                </div>
                <input
                  id="caption"
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  maxLength={20}
                  placeholder="20자 이내"
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="suspectTag" className="text-xs font-mono text-zinc-500">
                  관련 인물
                </label>
                <select
                  id="suspectTag"
                  value={suspectTag}
                  onChange={(event) => setSuspectTag(event.target.value)}
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-amber-400 focus:outline-none"
                >
                  <option value="">미지정</option>
                  {PHOTO_TAGS.map((tag) => (
                    <option key={tag.value} value={tag.value}>
                      {tag.label}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 rounded bg-amber-400 py-2.5 text-sm font-bold text-zinc-950 transition-colors disabled:opacity-50"
                >
                  {uploading ? "업로드 중..." : "업로드"}
                </button>
                <button
                  type="button"
                  onClick={closeSheet}
                  disabled={uploading}
                  className="rounded border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-bold text-zinc-300 disabled:opacity-50"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="촬영 증거 확대" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
