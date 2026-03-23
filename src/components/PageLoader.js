import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageLoader() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    // Fast progress to 80%, then wait, then complete
    const t1 = setTimeout(() => setProgress(30), 50);
    const t2 = setTimeout(() => setProgress(60), 150);
    const t3 = setTimeout(() => setProgress(80), 250);
    const t4 = setTimeout(() => setProgress(100), 450);
    const t5 = setTimeout(() => setLoading(false), 600);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-indigo-100">
        <div
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Full page overlay with spinner */}
      <div className="fixed inset-0 z-[9998] bg-white/70 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <p className="text-xs text-gray-400 font-medium tracking-wide">Loading...</p>
        </div>
      </div>
    </>
  );
}
