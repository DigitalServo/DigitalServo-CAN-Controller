import { create } from 'zustand';

export enum DriveMode {
  HybridControlBiSSCMTL = "HybridControlBiSSCMTL",
  P2PControlBiSSCMTL = "P2PControlBiSSCMTL",
};

export const DRIVE_MODE_OPTIONS = Object.values(DriveMode) as string[];

interface DriveModeStore {
  driveMode: DriveMode | undefined;
  setDriveMode: (key: string | undefined) => void
}

export const useDriveModeStore = create<DriveModeStore>((set, _get) => ({
  driveMode: undefined,
  setDriveMode: (key: string | undefined) => {
    if (key == "HybridControlBiSSCMTL") set({ driveMode: DriveMode.HybridControlBiSSCMTL });
    if (key == "P2PControlBiSSCMTL") set({ driveMode: DriveMode.P2PControlBiSSCMTL });
  },
}));
