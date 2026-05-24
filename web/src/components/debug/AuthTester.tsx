"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function AuthTester() {
  const isProd = process.env.NODE_ENV === "production";
  const { user, loading } = useAuthContext();
  const [loopDetected, setLoopDetected] = useState(false);
  const [route, setRoute] = useState("");  // ← اضافه

  useEffect(() => {
    setRoute(window.location.pathname);  // ← فقط در client

    const key = "loop_check";
    const prev = sessionStorage.getItem(key);
    const current = window.location.pathname;
    const now = Date.now();

    if (prev) {
      const { path, time } = JSON.parse(prev);
      if (path === current && now - time < 1000) {
        setLoopDetected(true);
      }
    }

    sessionStorage.setItem(key, JSON.stringify({ path: current, time: now }));
  }, []);

  if (isProd) return null;

  return (
    <div style={{
      position: "fixed", bottom: 10, right: 10,
      background: "#111", color: "#0f0",
      padding: "12px 16px", borderRadius: 8,
      fontSize: 12, zIndex: 999999, opacity: 0.85,
    }}>
      <div>🔍 <b>Auth Tester</b></div>
      <hr style={{ opacity: 0.2 }} />
      <div>loading: {loading ? "⏳" : "✔"}</div>
      <div>user: {loading ? "⏳" : user ? `✔ ${user.email}` : "❌"}</div>
      <div>route: {route}</div>
      {loopDetected && (
        <div style={{ color: "red", marginTop: 6 }}>⚠️ Redirect Loop</div>
      )}
    </div>
  );
}