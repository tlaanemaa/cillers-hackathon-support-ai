import { useEffect } from "react";

/**
 * Global scroll state to manage debounced scroll calls.
 * (You could also use a ref instead of a global, if you prefer.)
 */
const scrollState = {
  lastScrollTime: 0,
  scrollTimeout: null as NodeJS.Timeout | null,
};

/**
 * Scroll the window to the bottom.
 */
function scrollToBottom() {
  scrollState.lastScrollTime = Date.now();
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
}

/**
 * Calculates the distance from the bottom of the page.
 */
function getDistanceFromBottom(): number {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  return documentHeight - (scrollY + viewportHeight);
}

/**
 * Automatically scrolls the window to the bottom if the user is near the bottom
 * (within 200px) and not already pinned at the very bottom.
 *
 * This hook debounces rapid changes: if multiple dependencies cause updates
 * in quick succession, we only perform the final scroll.  That prevents janky
 * scrolling while still ensuring we end up at the bottom.
 */
export function useAutoScroll(dependencies: unknown[]): void {
  const scrollFrequency = 200;

  useEffect(() => {
    if (scrollState.scrollTimeout) return;
    const distanceFromBottom = getDistanceFromBottom();

    // Only scroll if the user is within 200px of the bottom
    // but not exactly at distance 0 (avoid spamming).
    if (distanceFromBottom <= 500 && distanceFromBottom > 0) {
      // If we haven't scrolled in the last 100ms, scroll immediately.
      if (Date.now() - scrollState.lastScrollTime > scrollFrequency) {
        scrollToBottom();
        return;
      }

      // Otherwise, debounce the scroll.
      scrollState.scrollTimeout = setTimeout(() => {
        scrollState.scrollTimeout = null;
        scrollToBottom();
      }, scrollFrequency);
    }
  }, dependencies);
}

export default useAutoScroll;
