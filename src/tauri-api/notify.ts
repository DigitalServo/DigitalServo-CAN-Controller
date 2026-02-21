
import { isPermissionGranted, Options, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

export async function notify(contents: Options) {
  let granted = await isPermissionGranted()

  if (!granted) {
    const permission = await requestPermission()
    granted = permission === 'granted'
  }

  if (granted) {
    sendNotification(contents);
  } else {
    console.log("Not authorized to notify")
  }
}
