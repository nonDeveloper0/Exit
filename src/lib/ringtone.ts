"use client";

// 수신 대기 중에는 Galaxy_Bells.mp3를 반복 재생한다.
// 모바일 자동재생 정책 때문에 첫 사용자 제스처에서 무음 재생으로 오디오를 미리 해제한다.
const RINGTONE_URL = "/audio/Galaxy_Bells.mp3";

let unlockBound = false;
let ringTimer: ReturnType<typeof setInterval> | null = null;
let ringAudio: HTMLAudioElement | null = null;

function getRingAudio() {
  if (typeof window === "undefined") return null;
  if (!ringAudio) {
    ringAudio = new Audio(RINGTONE_URL);
    ringAudio.loop = true;
    ringAudio.preload = "auto";
  }
  return ringAudio;
}

export function armAudioUnlock() {
  if (unlockBound || typeof window === "undefined") return;
  unlockBound = true;

  const unlock = () => {
    const audio = getRingAudio();
    if (!audio) return;
    audio.muted = true;
    void audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
    }).catch(() => {
      audio.muted = false;
    });
  };

  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
}

export function startRingtone() {
  const audio = getRingAudio();
  if (!audio) return;
  audio.loop = true;
  audio.currentTime = 0;
  void audio.play();

  const vibrate = () => navigator.vibrate?.([500, 200, 500]);
  vibrate();
  if (ringTimer) clearInterval(ringTimer);
  ringTimer = setInterval(vibrate, 3000);
}

export function stopRingtone() {
  if (ringTimer) {
    clearInterval(ringTimer);
    ringTimer = null;
  }
  if (ringAudio) {
    ringAudio.pause();
    ringAudio.currentTime = 0;
  }
  navigator.vibrate?.(0);
}
