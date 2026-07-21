"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });
  const [isPointer, setIsPointer] = useState(false);
  const [isFine, setIsFine] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const updateMedia = () => setIsFine(media.matches);
    media.addEventListener("change", updateMedia);

    const move = (e: MouseEvent) => {
      x.set(e.clientX - 8);
      y.set(e.clientY - 8);
      const target = e.target as HTMLElement;
      setIsPointer(Boolean(target.closest("a, button, [data-cursor-hover]")));
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      media.removeEventListener("change", updateMedia);
    };
  }, [x, y]);

  if (!isFine) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 rounded-full mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        width: 16,
        height: 16,
        background: "#f2f1ec",
      }}
      animate={{ scale: isPointer ? 2.5 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  );
}
