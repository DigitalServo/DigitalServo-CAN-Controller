import { create } from 'zustand';

interface NodeIdStore {
  nodeId: number | null;
  setNodeId: (nodeId: number | null) => void
}

export const useNodeIdStore = create<NodeIdStore>((set, _get) => ({
  nodeId: null,
  setNodeId: (nodeId: number | null) => {
    set({ nodeId });
  },
}));
