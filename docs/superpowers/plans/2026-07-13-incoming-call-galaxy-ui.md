# Incoming Call Galaxy UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the incoming call overlay to show Park Miri and a Galaxy-like call UI without changing call behavior.

**Architecture:** Keep all interaction and Supabase behavior in `IncomingCallOverlay.tsx`. Add only small CSS keyframes/classes in `globals.css` if Tailwind utilities are not enough.

**Tech Stack:** Next.js 16 App Router, React client component, Tailwind CSS v4, Supabase client.

## Global Constraints

- All edited text files must be UTF-8 without BOM and LF.
- Read installed Next.js docs before code changes; this was checked for client components and `usePathname`.
- Preserve existing call logic: visibility gate, ringtone, vibration, slide accept, audio playback, and `CALL01` collection.

---

### Task 1: Incoming Call Overlay UI

**Files:**
- Modify: `src/components/IncomingCallOverlay.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `useIncomingCall()`, `markIncomingCallHandled()`, `getIsCallDevice()`, `startRingtone()`, `stopRingtone()`, `supabase.from("team_evidence_items").upsert(...)`
- Produces: The same default React component export with updated presentation only.

- [ ] Step 1: Add caller constants in `IncomingCallOverlay.tsx`:

```ts
const CALLER_NAME = "박미리";
const CALLER_NUMBER = "010-9876-2345";
const CALLER_INITIALS = "미리";
```

- [ ] Step 2: Replace hardcoded `발신번호 표시제한` and `TEL` caller UI with the constants.

- [ ] Step 3: Restyle the incoming state with One UI-like hierarchy: status row, label, name, number, centered avatar, bottom decline and slide accept controls.

- [ ] Step 4: Restyle the calling state with matching caller identity, timer, wave animation, and red end button.

- [ ] Step 5: Add any required CSS animation classes to `globals.css`.

- [ ] Step 6: Run `npm run lint`. Expected: exit code 0.

- [ ] Step 7: Run `npm run build`. Expected: exit code 0.

- [ ] Step 8: Update `progress.md` with completed files.