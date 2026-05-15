"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "@/components/ui/Portal";
import { Sidebar } from "@/components/layout/Sidebar";

type Props = {
  open: boolean;
  rtl: boolean;
  onClose: () => void;
  logout: () => void;
};

export default function MobileDrawer({
  open,
  rtl,
  onClose,
  logout,
}: Props) {
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.div
              className={`
                fixed top-0 bottom-0 z-50 md:hidden
                w-64 bg-emerald-700 text-white
                ${rtl ? "right-0" : "left-0"}
              `}
              initial={{ x: rtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: rtl ? "100%" : "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <Sidebar
                collapsed={false}
                isRtl={rtl}
                onToggleCollapse={() => {}}
                onLogout={logout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
