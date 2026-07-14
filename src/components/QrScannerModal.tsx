"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { useRouter } from "next/navigation";
import { resolveQrPath } from "@/lib/qrScan";

interface QrScannerModalProps {
  open: boolean;
  onClose: () => void;
}

export default function QrScannerModal({ open, onClose }: QrScannerModalProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastInvalidRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (!open) return;

    setError(null);
    setNotice(null);
    lastInvalidRef.current = null;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        video.srcObject = stream;
        video.play().catch(() => {});

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const tick = () => {
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const scale = Math.min(1, 480 / video.videoWidth);
            canvas.width = Math.round(video.videoWidth * scale);
            canvas.height = Math.round(video.videoHeight * scale);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code?.data) {
              const path = resolveQrPath(code.data);
              if (path) {
                stopStream();
                onClose();
                router.push(path);
                return;
              }
              if (lastInvalidRef.current !== code.data) {
                lastInvalidRef.current = code.data;
                setNotice("등록되지 않은 QR입니다. 다시 시도하세요.");
              }
            }
          }
          frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);
      })
      .catch((err: DOMException) => {
        if (cancelled) return;
        if (err.name === "NotAllowedError") {
          setError("카메라 권한이 거부됐습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.");
        } else if (err.name === "NotFoundError") {
          setError("카메라를 찾을 수 없습니다.");
        } else {
          setError("카메라를 사용할 수 없습니다.");
        }
      });

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [open, onClose, router, stopStream]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black">
      <div className="flex items-center justify-between p-4 text-zinc-200">
        <span className="text-sm font-bold">QR 스캐너</span>
        <button type="button" onClick={onClose} className="rounded px-2 py-1 text-sm">
          닫기
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        <canvas ref={canvasRef} hidden />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 rounded-2xl border-2 border-amber-400/80" />
        </div>
      </div>

      <div className="space-y-2 p-4 text-center">
        {error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <p className="text-sm text-zinc-400">{notice ?? "QR을 사각형 안에 맞춰주세요."}</p>
        )}
      </div>
    </div>
  );
}
