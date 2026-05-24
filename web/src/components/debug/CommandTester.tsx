"use client";

import { useMemo } from "react";
import { useCommandRegistry, resolveDisabled } from "@/context/CommandRegistry";

export default function CommandTester() {
  const isProd = process.env.NODE_ENV === "production";

  const { commands, context } = useCommandRegistry();

  const resolved = useMemo(() => {
    return Array.from(commands.values())
      .filter((cmd) => (cmd.when ? cmd.when(context) : true))
      .filter((cmd) => !resolveDisabled(cmd, context))
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }, [commands, context]);

  const visibleIds = useMemo(
    () => new Set(resolved.map((c) => c.id)),
    [resolved]
  );

  if (isProd) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "#222",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 8,
        fontSize: 12,
        zIndex: 999999,
        opacity: 0.9,
        maxHeight: "60vh",
        overflowY: "auto",
        width: 320,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        ⚡ <b>Command Tester</b>
      </div>

      <hr style={{ opacity: 0.2 }} />

      <div style={{ marginBottom: 8 }}>
        <b>Total Commands:</b> {commands.size}
      </div>

      <div style={{ marginBottom: 8 }}>
        <b>Visible Commands:</b> {resolved.length}
      </div>

      <hr style={{ opacity: 0.2 }} />

      {Array.from(commands.values()).map((cmd) => {
        const visible = visibleIds.has(cmd.id);
        const disabled = resolveDisabled(cmd, context);
        const when = cmd.when ? cmd.when(context) : true;

        return (
          <div
            key={cmd.id}
            style={{
              marginBottom: 10,
              padding: "6px 8px",
              background: visible ? "#0a0" : "#550",
              borderRadius: 6,
            }}
          >
            <div>
              <b>{cmd.label}</b> <small>({cmd.id})</small>
            </div>

            <div>Priority: {cmd.priority ?? 0}</div>
            <div>Group: {cmd.group ?? "-"}</div>
            <div>Shortcut: {cmd.shortcut?.join(" + ") ?? "-"}</div>

            <div>when(): {when ? "✔" : "❌"}</div>
            <div>disabled(): {disabled ? "❌" : "✔"}</div>

            <div>
              Visible:{" "}
              {visible ? (
                <span style={{ color: "#0f0" }}>✔</span>
              ) : (
                <span style={{ color: "red" }}>❌</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}