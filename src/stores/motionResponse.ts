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

export const useMotionResponseStore = create<MotionResponseStore>((set, get) => ({
  motionResponse: null,

  setMotionResponse: (payload) => {
    const LPF_GAIN: number = 0.8;
    const prevResponse = get().motionResponse;
    const newResponse = prevResponse != null? {
      position: (1.0 - LPF_GAIN) * prevResponse.position + LPF_GAIN * payload.position,
      velocity: (1.0 - LPF_GAIN) * prevResponse.velocity + LPF_GAIN * payload.velocity,
      force: (1.0 - LPF_GAIN) * prevResponse.force + LPF_GAIN * payload.force,
        disturbance: (1.0 - LPF_GAIN) * prevResponse.disturbance + LPF_GAIN * payload.disturbance,
    } : payload;

    set((_) => ({
      motionResponse: newResponse,
    }))
  },

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
