export function Card({ children }: any) {
  return (
    <div className="w-full max-w-md rounded-3xl 
                    border border-emerald-100 dark:border-gray-700 
                    bg-white dark:bg-gray-800 
                    p-8 shadow-2xl transition-colors">
      {children}
    </div>
  );
}