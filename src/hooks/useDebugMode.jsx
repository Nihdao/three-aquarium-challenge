import { useState, useEffect } from "react";

export function useDebugMode() {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    const checkDebugMode = () => {
      setIsDebugMode(window.location.hash.includes("#debug"));
    };

    // Vérifier au chargement initial
    checkDebugMode();

    // Écouter les changements de hash
    window.addEventListener("hashchange", checkDebugMode);

    return () => {
      window.removeEventListener("hashchange", checkDebugMode);
    };
  }, []);

  return isDebugMode;
}
