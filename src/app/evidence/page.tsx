"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PHOTO_LOCATION_TAGS, photoLocationTagLabel } from "@/lib/data";
import { filterPhotoEvidence } from "@/lib/photoEvidenceFilter";
import { PhotoItem, usePhotoEvidence } from "@/lib/usePhotoEvidence";
import QrScannerModal from "@/components/QrScannerModal";
import { useRole } from "@/lib/useRole";
import { MAX_PHOTOS_PER_GROUP } from "@/lib/photoUploadLimit";

function locationTabClass(location: string, selected: boolean): string {
  const colors: Record<string, string> = {
    WAREHOUSE: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    NA_CEO_OFFICE: "border-violet-400/40 bg-violet-400/10 text-violet-200",
    NA_TEAM_LEADER_OFFICE: "border-sky-400/40 bg-sky-400/10 text-sky-200",
    CHAE_MANAGER_LAB: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  };
  const selectedClass: Record<string, string> = {
    WAREHOUSE: "ring-2 ring-amber-300/70 bg-amber-400/20",
    NA_CEO_OFFICE: "ring-2 ring-violet-300/70 bg-violet-400/20",
    NA_TEAM_LEADER_OFFICE: "ring-2 ring-sky-300/70 bg-sky-400/20",
    CHAE_MANAGER_LAB: "ring-2 ring-emerald-300/70 bg-emerald-400/20",
  };
  return `${colors[location] ?? "border-zinc-700 bg-zinc-900 text-zinc-300"} ${selected ? selectedClass[location] ?? "" : ""}`;
}

export default function EvidencePage() {
  const { photos, loading, uploading, uploadPhoto, updatePhotoMetadata, updatingPhotoId, ownTeamId, ownPhotoCount, photoLimitReached } =
    usePhotoEvidence();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState(PHOTO_LOCATION_TAGS[0].value);
  const [lightboxPhotoId, setLightboxPhotoId] = useState<string | null>(null);
  const [editingMetadata, setEditingMetadata] = useState(false);
  const [editedCaption, setEditedCaption] = useState("");
  const [editedLocationTag, setEditedLocationTag] = useState("");
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const { isLeader, loaded: roleLoaded } = useRole();
  const lightboxPhoto = photos.find((photo) => photo.id === lightboxPhotoId) ?? null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const filteredPhotos = filterPhotoEvidence(photos, activeLocation);
  const locationPhotoCounts = Object.fromEntries(
    PHOTO_LOCATION_TAGS.map((location) => [
      location.value,
      photos.filter((photo) => photo.locationTag === location.value).length,
    ])
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setCaption("");
    setUploadError(null);
  }

  function closeUploadSheet() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setCaption("");
    setUploadError(null);
  }

  function openLightbox(photo: PhotoItem) {
    setLightboxPhotoId(photo.id);
    setEditingMetadata(false);
    setMetadataError(null);
  }

  function openMetadataEditor() {
    if (!lightboxPhoto || !isLeader) return;
    setEditedCaption(lightboxPhoto.caption ?? "");
    setEditedLocationTag(lightboxPhoto.locationTag ?? "");
    setMetadataError(null);
    setEditingMetadata(true);
  }

  function closeMetadataEditor() {
    if (updatingPhotoId === lightboxPhoto?.id) return;
    setEditingMetadata(false);
    setMetadataError(null);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setUploadError(null);
    try {
      await uploadPhoto(selectedFile, caption, activeLocation);
      closeUploadSheet();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "업로드 실패. 네트워크 상태를 확인하고 다시 시도하세요.");
    }
  }

  async function handleSaveMetadata() {
    if (!lightboxPhoto || !isLeader) return;

    setMetadataError(null);
    try {
      await updatePhotoMetadata(lightboxPhoto.id, editedCaption, editedLocationTag);
      setEditingMetadata(false);
    } catch {
      setMetadataError("저장에 실패했습니다. 네트워크 상태를 확인하고 다시 시도하세요.");
    }
  }

  const isUpdatingSelectedPhoto = updatingPhotoId === lightboxPhoto?.id;

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono tracking-widest text-amber-400 uppercase">Evidence Vault</div>
        <h1 className="text-2xl font-bold text-zinc-100">증거 보관함</h1>
        <p className="text-sm text-zinc-500">
          {ownTeamId ? `${ownTeamId}조 사진 ${ownPhotoCount}/${MAX_PHOTOS_PER_GROUP}장 · 조별 한도` : "조 정보를 찾을 수 없습니다"}
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

      {ownTeamId && (
        <p className="-mt-2 text-center text-xs text-zinc-500">
          사진은 조별 최대 {MAX_PHOTOS_PER_GROUP}장입니다. 짝 조와 한도를 공유하지 않습니다.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={!ownTeamId || !roleLoaded || !isLeader || photoLimitReached}
          className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 text-amber-200 transition-colors active:scale-[0.99] disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            <path d="M4 8a2 2 0 0 1 2-2h1.2a1 1 0 0 0 .86-.5l.9-1.5a1 1 0 0 1 .86-.5h4.36a1 1 0 0 1 .86.5l.9 1.5a1 1 0 0 0 .86.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
          <span className="text-sm font-bold leading-tight text-center">{photoLimitReached ? "사진 한도 도달" : "현장 증거 촬영"}</span>
        </button>

        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          disabled={!ownTeamId || !roleLoaded || !isLeader}
          className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 text-amber-200 transition-colors active:scale-[0.99] disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            <path d="M4 8V6a2 2 0 0 1 2-2h2" />
            <path d="M16 4h2a2 2 0 0 1 2 2v2" />
            <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
            <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
          </svg>
          <span className="text-sm font-bold leading-tight text-center">QR 스캐너</span>
        </button>
      </div>

      {roleLoaded && !isLeader && <p className="-mt-2 text-center text-xs text-zinc-500">사진 업로드와 QR 스캔은 조장만 할 수 있습니다.</p>}
      {photoLimitReached ? (
        <p className="-mt-2 text-center text-xs text-zinc-500">이 조의 사진 등록 한도({MAX_PHOTOS_PER_GROUP}장)에 도달했습니다.</p>
      ) : (
        <p className="-mt-2 flex flex-col text-center text-xs text-zinc-500">
          <span>사건과 관련된 단서 사진만 업로드하세요.</span>
          <span>사진은 조별 최대 {MAX_PHOTOS_PER_GROUP}장까지 등록할 수 있습니다.</span>
        </p>
      )}

      <div className="grid grid-cols-4 gap-1">
        {PHOTO_LOCATION_TAGS.map((location) => (
          <button key={location.value} type="button" onClick={() => setActiveLocation(location.value)} className={`min-w-0 rounded-full border px-1 py-2 text-[10px] font-bold tracking-tight whitespace-nowrap transition-shadow ${locationTabClass(location.value, activeLocation === location.value)}`}>
            {location.label} ({locationPhotoCounts[location.value]})
          </button>
        ))}
      </div>
      <p className="-mt-2 text-center text-xs text-zinc-500">현장 증거 촬영은 선택된 장소에 업로드됩니다.</p>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="aspect-[3/4] animate-pulse rounded bg-zinc-900" />
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">
            {photos.length === 0 ? "아직 촬영한 증거가 없습니다." : "선택한 장소의 증거가 없습니다."}
          </p>
          <p className="mt-1 text-xs text-zinc-600">현장을 사진으로 남기세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredPhotos.map((photo) => {
            const locationLabel = photoLocationTagLabel(photo.locationTag);
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => openLightbox(photo)}
                className={`relative rotate-[-0.5deg] bg-zinc-100 p-2 pb-4 text-left shadow-lg transition-transform active:scale-[0.98] even:rotate-[0.7deg] ${
                  photo.status === "rejected" ? "opacity-45 grayscale" : ""
                }`}
              >
                <span className="absolute left-3 top-3 rounded bg-zinc-950/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                  #{photo.evidenceNumber}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt={photo.caption ?? "촬영 증거"}
                  className="aspect-square w-full bg-zinc-300 object-cover"
                  loading="lazy"
                />
                {photo.status === "rejected" && (
                  <span className="absolute right-3 top-3 rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white">
                    제외됨
                  </span>
                )}
                <div className="mt-2 min-h-12 space-y-1">
                  <p
                    className="text-center text-sm leading-tight text-zinc-900"
                    style={{ fontFamily: '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive' }}
                  >
                    {photo.caption || "— 기록 없음 —"}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {locationLabel && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                        {locationLabel}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-[80] flex items-end bg-black/70 p-3">
          <div className="max-h-[calc(100dvh-5rem)] w-full overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-950 p-4 pb-24 shadow-2xl">
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="업로드 미리보기" className="max-h-[42vh] w-full rounded bg-zinc-900 object-contain" />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="caption" className="text-xs font-mono text-zinc-500">증거 설명</label>
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
              <p className="text-xs text-zinc-500">장소: {photoLocationTagLabel(activeLocation)}</p>
              {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={handleUpload} disabled={uploading} className="flex-1 rounded bg-amber-400 py-2.5 text-sm font-bold text-zinc-950 transition-colors disabled:opacity-50">
                  {uploading ? "업로드 중..." : "업로드"}
                </button>
                <button type="button" onClick={closeUploadSheet} disabled={uploading} className="rounded border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-bold text-zinc-300 disabled:opacity-50">
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {lightboxPhoto && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/90 p-4">
          <div className="max-h-full w-full max-w-lg space-y-3 overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="font-mono text-xs text-amber-300">#{lightboxPhoto.evidenceNumber}</span>
              <button type="button" onClick={() => setLightboxPhotoId(null)} className="rounded px-2 py-1 text-sm">닫기</button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxPhoto.imageUrl} alt={lightboxPhoto.caption ?? "촬영 증거 확대"} className="max-h-[60vh] w-full object-contain" />
            <div className="rounded-lg bg-zinc-900 p-3 text-zinc-100">
              <p className="text-xs font-mono text-zinc-500">증거 설명</p>
              <p className="mt-1 text-sm">{lightboxPhoto.caption || "— 기록 없음 —"}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {photoLocationTagLabel(lightboxPhoto.locationTag) && <span className="rounded-full bg-amber-400/20 px-2 py-1 text-xs text-amber-200">{photoLocationTagLabel(lightboxPhoto.locationTag)}</span>}
              </div>
            </div>
            {roleLoaded && isLeader && <button type="button" onClick={openMetadataEditor} className="w-full rounded border border-amber-400/60 py-2.5 text-sm font-bold text-amber-200">정보 수정</button>}
          </div>
        </div>
      )}

      {editingMetadata && lightboxPhoto && isLeader && (
        <div className="fixed inset-0 z-[90] flex items-end bg-black/70 p-3">
          <div className="max-h-[calc(100dvh-5rem)] w-full overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-950 p-4 pb-24 shadow-2xl">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-zinc-100">사진 정보 수정</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="edit-caption" className="text-xs font-mono text-zinc-500">증거 설명</label>
                  <span className="text-xs font-mono text-zinc-600">{editedCaption.length}/20</span>
                </div>
                <input
                  id="edit-caption"
                  value={editedCaption}
                  onChange={(event) => setEditedCaption(event.target.value)}
                  maxLength={20}
                  placeholder="20자 이내"
                  disabled={isUpdatingSelectedPhoto}
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div className="space-y-1"><label htmlFor="edit-location" className="text-xs font-mono text-zinc-500">관련 장소</label><select id="edit-location" value={editedLocationTag} onChange={(event) => setEditedLocationTag(event.target.value)} disabled={isUpdatingSelectedPhoto} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100">{PHOTO_LOCATION_TAGS.map((tag) => <option key={tag.value} value={tag.value}>{tag.label}</option>)}</select></div>
              {metadataError && <p className="text-xs text-red-400">{metadataError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={handleSaveMetadata} disabled={isUpdatingSelectedPhoto} className="flex-1 rounded bg-amber-400 py-2.5 text-sm font-bold text-zinc-950 disabled:opacity-50">
                  {isUpdatingSelectedPhoto ? "저장 중..." : "저장"}
                </button>
                <button type="button" onClick={closeMetadataEditor} disabled={isUpdatingSelectedPhoto} className="rounded border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-bold text-zinc-300 disabled:opacity-50">취소</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <QrScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
}
