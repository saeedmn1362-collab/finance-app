export function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 
                 bg-white dark:bg-gray-700 
                 text-gray-900 dark:text-white 
                 p-3 outline-none transition 
                 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-gray-600"
    />
  );
}