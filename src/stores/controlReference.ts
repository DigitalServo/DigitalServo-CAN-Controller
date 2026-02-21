import { create } from 'zustand';

export type P2PControlReference = {
  distanceRad: number,
  durationS: number,
};

export type HybridControlReference = {
  torqueFeedforward: number,
  positionReference: number,
  velocityReference: number,
  torqueReference: number,
  positionGain: number,
  velocityGain: number,
  torqueGain: number,
  torqueLimit: number,
};

interface ControlReferenceStore {
  p2pControlReference: P2PControlReference | undefined,
  setP2PControlReference: (reference: P2PControlReference | undefined) => void;

  hybridControlReference: HybridControlReference | undefined,
  setHybridControlReference: (reference: HybridControlReference | undefined) => void;
}

export const useControlReferenceStore = create<ControlReferenceStore>((set, _get) => ({
  p2pControlReference: undefined,
  setP2PControlReference: (reference: P2PControlReference | undefined) => {
    set({ p2pControlReference: reference });
  },

  hybridControlReference: undefined,
  setHybridControlReference: (reference: HybridControlReference | undefined) => {
    set({ hybridControlReference: reference });
  },
}));
