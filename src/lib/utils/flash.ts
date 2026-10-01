const FLASH_KEY = "tamaade:flash";
export const FLASH_EVENT = "tamaade:flash";

/** Queue a one-time message to show after the next navigation. */
export function setFlashMessage(message: string) {
  try {
    window.sessionStorage.setItem(FLASH_KEY, message);
  } catch {
    // Storage unavailable — the message is simply not shown.
  }
  window.dispatchEvent(new Event(FLASH_EVENT));
}

/** Read and clear the pending flash message. */
export function takeFlashMessage(): string | null {
  try {
    const message = window.sessionStorage.getItem(FLASH_KEY);
    if (message) window.sessionStorage.removeItem(FLASH_KEY);
    return message;
  } catch {
    return null;
  }
}
