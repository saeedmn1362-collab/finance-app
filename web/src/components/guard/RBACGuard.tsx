"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function RBACGuard({
  children,
  roles,
  permissions,
  fallback = <div>Loading...</div>,
}: {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  fallback?: React.ReactNode;
}) {
  const router = useRouter();
  const { user, role, permissions: userPermissions, loading } = useAuthContext();

  const allowed = useMemo(() => {
    if (!user) return false;

    if (roles && roles.length > 0) {
      if (!role || !roles.includes(role)) return false;
    }

    if (permissions && permissions.length > 0) {
      const hasAll = permissions.every((p) => userPermissions.includes(p));
      if (!hasAll) return false;
    }

    return true;
  }, [user, role, userPermissions, roles, permissions]);

  useEffect(() => {
    if (!loading && !allowed) {
      router.replace("/");
    }
  }, [loading, allowed, router]);

  if (loading) return <>{fallback}</>;
  if (!allowed) return null;

  return <>{children}</>;
}
