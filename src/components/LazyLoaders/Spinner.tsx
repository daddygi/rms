// components/Loader.tsx
import { useEffect, useState } from "react";

export default function Loader() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
      <h3 className="text-center text-gray-500 text-lg font-medium">
        Loading{dots}
      </h3>
    </div>
  );
}
