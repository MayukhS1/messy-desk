"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isEmailVerified } from "@/lib/auth/utils";
import { Button } from "@/components/ui/Button";
import { RouteLoader } from "@/components/navigation/RouteLoader";

const BOOTSTRAP_KEY = "messy-desk-bootstrapped";

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const runBootstrap = async () => {
    setStatus("loading");
    setErrorMsg("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      sessionStorage.removeItem(BOOTSTRAP_KEY);
      setStatus("ready");
      return;
    }

    if (!isEmailVerified(user)) {
      sessionStorage.removeItem(BOOTSTRAP_KEY);
      setStatus("ready");
      return;
    }

    const { error } = await supabase.rpc("ensure_user_setup");

    if (error) {
      sessionStorage.removeItem(BOOTSTRAP_KEY);
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }

    sessionStorage.setItem(BOOTSTRAP_KEY, "1");
    setStatus("ready");
  };

  useEffect(() => {
    if (sessionStorage.getItem(BOOTSTRAP_KEY) === "1") {
      setStatus("ready");
      return;
    }
    runBootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") {
    return <RouteLoader message="Setting up your desk…" />;
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-foreground font-medium">Could not set up your account</p>
        <p className="text-sm text-muted max-w-md">{errorMsg}</p>
        <p className="text-xs text-muted max-w-md">
          Run migration{" "}
          <code className="bg-secondary px-1 rounded">
            supabase/migrations/003_repair_user_setup.sql
          </code>{" "}
          in the Supabase SQL editor, then retry.
        </p>
        <Button onClick={runBootstrap}>Retry</Button>
      </div>
    );
  }

  return <>{children}</>;
}
