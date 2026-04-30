export function LoadingSpinner({ label = "Loading" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-teal-900/35 ${className}`} />;
}

