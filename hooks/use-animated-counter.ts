"use client";

import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(end: number, duration = 800): number {
  const [value, setValue] = useState(end);
  const valueRef = useRef(end);

  useEffect(() => {
    const start = valueRef.current;
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const newValue = start + (end - start) * ease;
      setValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(end);
        valueRef.current = end;
      }
    };

    requestAnimationFrame(step);
  }, [end, duration]);

  return value;
}
