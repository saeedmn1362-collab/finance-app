"use client";

export function Button({
  children,
  loading,
  ...props
}: any) {
  return (
    <button
      {...props}
      className="w-full rounded-2xl bg-emerald-500 dark:bg-emerald-600 
                 py-3 text-white font-bold transition 
                 hover:bg-emerald-600 active:scale-[0.98]
                 disabled:opacity-50"
    >
      {loading ? "در حال پردازش..." : children}
    </button>
  );
}