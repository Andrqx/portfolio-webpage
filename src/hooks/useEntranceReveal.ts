"use client";

import { useEffect, useState } from "react";

export const ENTRANCE_COMPLETE_EVENT = "portfolio:entrance-complete";
const SESSION_KEY = "portfolio-entered";
const FLASH_MS = 500;

export function dispatchEntranceComplete() {
  window.dispatchEvent(new Event(ENTRANCE_COMPLETE_EVENT));
}

/**
 * Defers a component's entrance animation until the intro overlay finishes
 * (or plays immediately if the intro was already seen this session), and
 * exposes a brief `flash` pulse synced to that same moment — so the page's
 * own reveal motion lines up with the entrance dissolving away instead of
 * having already finished, invisibly, while still hidden behind it.
 */
export function useEntranceReveal() {
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const alreadyEntered = window.sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyEntered) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe reveal: matches HomeExperience's pattern
      setReady(true);
      return;
    }

    let hideTimer = 0;
    const handler = () => {
      setReady(true);
      setFlash(true);
      hideTimer = window.setTimeout(() => setFlash(false), FLASH_MS);
    };
    window.addEventListener(ENTRANCE_COMPLETE_EVENT, handler);
    return () => {
      window.removeEventListener(ENTRANCE_COMPLETE_EVENT, handler);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return { ready, flash };
}
