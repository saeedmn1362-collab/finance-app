"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type AuthUser = {
  userId: string;
  role: "admin" | "user" | "readonly";
  permissions: string[];
};

export type CommandContext = {
  auth: {
    user: AuthUser | null;
  };

  route: string;

  locale: string;

  flags: Record<string, boolean>;
};

export type Command = {
  id: string;

  label: string;

  icon?: React.ReactNode;

  keywords?: string[];

  shortcut?: string[];

  group?: string;

  priority?: number;

  closeOnRun?: boolean;

  when?: (ctx: CommandContext) => boolean;

  disabled?: boolean | ((ctx: CommandContext) => boolean);

  action: (ctx: CommandContext) => void | Promise<void>;
};

// ─────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────

type RegistryValue = {
  commands: Map<string, Command>;

  context: CommandContext;

  register: (cmd: Command) => () => void;

  setContext: (partial: Partial<CommandContext>) => void;
};

const CommandRegistryContext = createContext<RegistryValue | null>(null);

// ─────────────────────────────────────────────────────────────
// DEFAULT CONTEXT
// ─────────────────────────────────────────────────────────────

const DEFAULT_CONTEXT: CommandContext = {
  auth: {
    user: null,
  },

  route: "/",

  locale: "fa",

  flags: {},
};

// ─────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────

export function CommandRegistryProvider({
  children,
  initialContext,
}: {
  children: ReactNode;
  initialContext?: Partial<CommandContext>;
}) {
  // COMMAND STORE
  const [commands, setCommands] = useState<Map<string, Command>>(
    () => new Map()
  );

  // CONTEXT STORE
  const [context, setContextState] = useState<CommandContext>({
    ...DEFAULT_CONTEXT,
    ...initialContext,
  });

  // REGISTER COMMAND
  const register = useCallback((cmd: Command) => {
    setCommands((prev) => {
      const next = new Map(prev);
      next.set(cmd.id, cmd);
      return next;
    });

    return () => {
      setCommands((prev) => {
        const next = new Map(prev);
        next.delete(cmd.id);
        return next;
      });
    };
  }, []);

  // UPDATE CONTEXT (SAFE MERGE)
  const setContext = useCallback((partial: Partial<CommandContext>) => {
    setContextState((prev) => ({
      ...prev,
      ...partial,

      // SAFE MERGE for auth
      auth: partial.auth ?? prev.auth,

      // SAFE MERGE for flags
      flags: partial.flags
        ? {
            ...prev.flags,
            ...partial.flags,
          }
        : prev.flags,
    }));
  }, []);

  // MEMOIZED VALUE
  const value = useMemo(() => {
    return {
      commands,
      context,
      register,
      setContext,
    };
  }, [commands, context, register, setContext]);

  return (
    <CommandRegistryContext.Provider value={value}>
      {children}
    </CommandRegistryContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────

export function useCommandRegistry() {
  const ctx = useContext(CommandRegistryContext);

  if (!ctx) {
    throw new Error("useCommandRegistry must be used inside CommandRegistryProvider");
  }

  return ctx;
}

// ─────────────────────────────────────────────────────────────
// DISABLED RESOLVER
// ─────────────────────────────────────────────────────────────

export function resolveDisabled(cmd: Command, ctx: CommandContext): boolean {
  if (typeof cmd.disabled === "function") {
    return cmd.disabled(ctx);
  }

  return cmd.disabled ?? false;
}

// ─────────────────────────────────────────────────────────────
// RESOLVED COMMANDS
// ─────────────────────────────────────────────────────────────

export function useResolvedCommands() {
  const { commands, context } = useCommandRegistry();

  return useMemo(() => {
    return Array.from(commands.values())
      .filter((cmd) => {
        if (!cmd.when) return true;
        return cmd.when(context);
      })
      .filter((cmd) => {
        return !resolveDisabled(cmd, context);
      })
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }, [commands, context]);
}
