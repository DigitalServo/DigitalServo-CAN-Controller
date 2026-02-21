import type * as TauriApi from "@tauri-apps/api";

declare global {
  interface Window {
    __TAURI__?: TauriApi;
  }
}

export {};
