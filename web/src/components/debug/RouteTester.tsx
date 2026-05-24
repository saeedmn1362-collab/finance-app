"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteTester() {
  const isProd = process.env.NODE_ENV === "production";

  const pathname = usePathname();

  const prevRef = useRef<string | null>(null);

  const [loopDetected, setLoopDetected] = useState(false);

  useEffect(() => {
    const prev = prevRef.current;

    // Detect only if navigation ping-pong happens
    if (prev && prev === pathname) {
      setLoopDetected(true);
    }

    prevRef.current = pathname;
  }, [pathname]);

  if (isProd) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        left: 10,
        background: "#111",
        color: "#0ff",
        padding: 12,
        borderRadius: 8,
        fontSize: 12,
        zIndex: 999999,
      }}
    >
      <div>🛰 Route Tester</div>
      <div>Current: {pathname}</div>

      {loopDetected && (
        <div style={{ color: "red" }}>
          ⚠️ Possible Loop Detected
        </div>
      )}
    </div>
  );
}
