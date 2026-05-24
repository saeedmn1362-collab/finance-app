"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCommandRegistry } from "@/context/CommandRegistry";

export default function RouteSync() {
  const pathname = usePathname();
  const { setContext } = useCommandRegistry();

  useEffect(() => {
    setContext({
      route: pathname,
    });
  }, [pathname, setContext]);

  return null;
}