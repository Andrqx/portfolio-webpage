"use client";

import { useEffect, useState, type ReactNode } from "react";
import Entrance from "@/components/Entrance";

const SESSION_KEY = "portfolio-entered";

export default function HomeExperience({ children }: { children: ReactNode }) {
  // Starts false to match the static/prerendered HTML, then flips after
  // mount based on sessionStorage — reading sessionStorage during the
  // initial render would desync client output from the prerendered markup.
  const [showEntrance, setShowEntrance] = useState(false);

  useEffect(() => {
    const alreadyEntered = window.sessionStorage.getItem(SESSION_KEY) === "1";
    if (!alreadyEntered) {
      // The browser's own scroll restoration can put scrollY > 0 before this
      // runs (e.g. after a reload mid-page). With the entrance covering the
      // viewport that jump is invisible until we unlock scroll on entry, so
      // it looks like clicking the globe "teleports" you into the page.
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
      setShowEntrance(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = showEntrance ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showEntrance]);

  const handleEnter = () => {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    window.scrollTo(0, 0);
    setShowEntrance(false);
  };

  return (
    <>
      {showEntrance && <Entrance onEnter={handleEnter} />}
      {children}
    </>
  );
}
