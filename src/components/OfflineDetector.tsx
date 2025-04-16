"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface OfflineDetectorProps {
  children: React.ReactNode;
}

const OfflineDetector: React.FC<OfflineDetectorProps> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    // Verificar estado inicial
    setIsOffline(!navigator.onLine);

    // Configurar event listeners
    const handleOffline = () => {
      setIsOffline(true);
      toast.error(
        "Sem conexão com a internet. Algumas funcionalidades podem estar indisponíveis.",
        {
          duration: 4000,
          id: "offline-toast",
        }
      );
    };

    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Conexão com a internet restaurada!", {
        duration: 3000,
        id: "online-toast",
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 w-full bg-orange-500 text-white p-2 text-center z-50">
          <p className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
            </svg>
            Você está offline. Algumas funcionalidades estão indisponíveis.
          </p>
        </div>
      )}
      {children}
    </>
  );
};

export default OfflineDetector;
