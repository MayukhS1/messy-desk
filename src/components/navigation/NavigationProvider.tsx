"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { RouteLoader } from "./RouteLoader";

type NavigationContextValue = {
  isNavigating: boolean;
  startNavigation: (href: string) => void;
};

const NavigationContext = createContext<NavigationContextValue>({
  isNavigating: false,
  startNavigation: () => {},
});

export function useNavigation() {
  return useContext(NavigationContext);
}

function isInternalAppHref(href: string) {
  if (!href.startsWith("/")) return false;
  if (href.startsWith("//")) return false;
  return true;
}

function normalizePath(href: string) {
  try {
    const url = new URL(href, "http://local");
    return url.pathname;
  } catch {
    return href.split("?")[0]?.split("#")[0] ?? href;
  }
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [message, setMessage] = useState("Opening…");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNavigation = useCallback(() => {
    setIsNavigating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startNavigation = useCallback(
    (href: string) => {
      const target = normalizePath(href);
      if (target === pathname || pathname.startsWith(target + "/")) return;

      const labels: Record<string, string> = {
        "/dashboard": "Heading home…",
        "/room": "Entering your room…",
        "/desk/edit": "Opening the editor…",
        "/settings": "Opening settings…",
      };
      setMessage(labels[target] ?? "Opening…");
      setIsNavigating(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, 15000);
    },
    [pathname]
  );

  useEffect(() => {
    clearNavigation();
  }, [pathname, clearNavigation]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !isInternalAppHref(href)) return;
      if (anchor.getAttribute("target") === "_blank") return;

      startNavigation(href);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [startNavigation]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation }}>
      {children}
      {isNavigating && <RouteLoader message={message} overlay />}
    </NavigationContext.Provider>
  );
}
