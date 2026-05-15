type SkeletonProps = {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
};

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function Skeleton({
  className = "",
  rounded = "md",
}: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse 
        bg-gray-300 dark:bg-gray-700 
        ${roundedMap[rounded]} 
        ${className}
      `}
    />
  );
}