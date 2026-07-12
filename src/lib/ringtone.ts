"use client";

// 수신전화 벨소리(Web Audio 합성) + 진동.
// 수신 화면은 관리자 브로드캐스트로 "자동" 등장하므로, 모바일 자동재생 정책상
// 첫 사용자 터치에서 AudioContext를 깨워(armAudioUnlock) 두어야 이후 재생된다.
// 진동은 navigator.vibrate — Android만 동작하고 iOS Safari는 무시한다(웹 제약).

type WindowWithWebkitAudio = typeof window & {
  webkitAudioContext?: typeof AudioContext;
};

let ctx: AudioContext | null = null;
let unlockBound = false;
let ringTimer: ReturnType<typeof setInterval> | null = null;
let active: { osc: OscillatorNode; gain: GainNode }[] = [];

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

// 앱 첫 제스처에 AudioContext를 깨워 이후 자동 등장하는 수신 화면에서도 소리가 나게 한다.
export function armAudioUnlock() {
  if (unlockBound || typeof window === "undefined") return;
  unlockBound = true;
  const unlock = () => {
    const c = getCtx();
    if (c && c.state === "suspended") void c.resume();
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
}

// "따르릉" 한 번(1초 울림) — 480/440Hz 교차 워블
function scheduleRing(c: AudioContext) {
  const start = c.currentTime + 0.02;
  const dur = 1.0;

  const gain = c.createGain();
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.25, start + 0.04);
  gain.gain.setValueAtTime(0.25, start + dur - 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  const osc = c.createOscillator();
  osc.type = "sine";
  for (let t = 0; t < dur; t += 0.1) {
    osc.frequency.setValueAtTime(t % 0.2 < 0.1 ? 480 : 440, start + t);
  }
  osc.connect(gain);
  osc.start(start);
  osc.stop(start + dur);

  const node = { osc, gain };
  active.push(node);
  osc.onended = () => {
    active = active.filter((a) => a !== node);
  };
}

export function startRingtone() {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();

  const cycle = () => {
    const c2 = getCtx();
    if (!c2) return;
    scheduleRing(c2);
    navigator.vibrate?.([500, 200, 500]); // Android만, iOS는 무시
  };

  cycle();
  if (ringTimer) clearInterval(ringTimer);
  ringTimer = setInterval(cycle, 3000); // 1초 울림 + 2초 쉼
}

export function stopRingtone() {
  if (ringTimer) {
    clearInterval(ringTimer);
    ringTimer = null;
  }
  for (const { osc, gain } of active) {
    try {
      osc.stop();
    } catch {}
    try {
      gain.disconnect();
    } catch {}
  }
  active = [];
  navigator.vibrate?.(0);
}

// 카운트다운 종료 경보 — "삐빅삐빅" 3연타를 약 4회 반복(약 4초) 후 자동 정지 + 진동.
// 수신 화면과 마찬가지로 armAudioUnlock으로 깨워둔 AudioContext를 사용한다.
let alarmTimer: ReturnType<typeof setInterval> | null = null;

function scheduleBeep(c: AudioContext, freq: number, when: number, dur: number) {
  const gain = c.createGain();
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(0.3, when + 0.02);
  gain.gain.setValueAtTime(0.3, when + dur - 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);

  const osc = c.createOscillator();
  osc.type = "square";
  osc.frequency.value = freq;
  osc.connect(gain);
  osc.start(when);
  osc.stop(when + dur);

  const node = { osc, gain };
  active.push(node);
  osc.onended = () => {
    active = active.filter((a) => a !== node);
  };
}

export function playAlarm() {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();

  const burst = () => {
    const c2 = getCtx();
    if (!c2) return;
    const t = c2.currentTime + 0.02;
    scheduleBeep(c2, 988, t, 0.16);
    scheduleBeep(c2, 988, t + 0.24, 0.16);
    scheduleBeep(c2, 988, t + 0.48, 0.16);
    navigator.vibrate?.([250, 120, 250, 120, 250]);
  };

  burst();
  let count = 1;
  if (alarmTimer) clearInterval(alarmTimer);
  alarmTimer = setInterval(() => {
    burst();
    count += 1;
    if (count >= 4) stopAlarm();
  }, 1000);
}

export function stopAlarm() {
  if (alarmTimer) {
    clearInterval(alarmTimer);
    alarmTimer = null;
  }
  navigator.vibrate?.(0);
}
