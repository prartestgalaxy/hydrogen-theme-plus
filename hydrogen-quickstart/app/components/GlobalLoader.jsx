import { useNavigation } from 'react-router';
import { useEffect, useState } from "react";

export function GlobalLoader() {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);

  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";

  useEffect(() => {
    let timer;

    if (isLoading && navigation.location) {
      const currentUrl = new URL(window.location.href);
      const nextUrl = new URL(
        navigation.location.pathname + navigation.location.search,
        window.location.origin
      );

      // 👇 Ignore specific params
      const ignoreParams = ["Color", "Size", "tab","q"]; // Add 'tab' to ignored params

      ignoreParams.forEach((param) => {
        currentUrl.searchParams.delete(param);
        nextUrl.searchParams.delete(param);
      });

      const isSamePage =
        currentUrl.pathname === nextUrl.pathname &&
        currentUrl.search === nextUrl.search;

      if (!isSamePage) {
        // ✅ real navigation (different page or different non-ignored params)
        timer = setTimeout(() => setShow(true), 50);
      } else {
        // ❌ only ignored parameter changes (variant params, tab changes)
        setShow(false);
      }
    } else {
      setShow(false);
    }

    return () => clearTimeout(timer);
  }, [isLoading, navigation.location]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Spinner */}
      <div className="h-14 w-14 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
    </div>
  );
}