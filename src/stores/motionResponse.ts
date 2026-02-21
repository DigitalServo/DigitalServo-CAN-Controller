'use client';

import { create } from 'zustand';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

const EVENT_NAME: string = "monitor_response";


type MotionResponsePayload = {
  position: number,
  velocity: number,
  force: number,
  disturbance: number
};

interface MotionResponseStore {
  motionResponse: MotionResponsePayload | null;
  setMotionResponse: (payload: MotionResponsePayload) => void;
  clearMotionResponse: () => void;
}

export const useMotionResponseStore = create<MotionResponseStore>((set) => ({
  motionResponse: null,

  setMotionResponse: (payload) =>
    set((_) => ({
      motionResponse: payload,
    })),

  clearMotionResponse: () => set({ motionResponse: null}),
}));

let unlistenFn: UnlistenFn | null = null;

export async function setupMotionResponseListener() {
  if (unlistenFn) return;

  try {
    unlistenFn = await listen<MotionResponsePayload>(EVENT_NAME, (event) => {
      const motionResponse = event.payload;
      useMotionResponseStore.getState().setMotionResponse(motionResponse);
    });
    console.log('Wake up MotionResponse listner.');
  } catch (err) {
    console.error('Failed to wake up MotionResponse listner:', err);
  }
}

export function cleanupMotionResponseListener() {
  if (unlistenFn) {
    unlistenFn();
    unlistenFn = null;
  }
}
