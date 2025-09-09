import { useState, useEffect } from "react";

export function useDebugMode() {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    const checkDebugMode = () => {
      setIsDebugMode(window.location.hash.includes("#debug"));
    };

    // Check at initial load
    checkDebugMode();

    // Listen for hash changes
    window.addEventListener("hashchange", checkDebugMode);

    return () => {
      window.removeEventListener("hashchange", checkDebugMode);
    };
  }, []);

  return isDebugMode;
}
