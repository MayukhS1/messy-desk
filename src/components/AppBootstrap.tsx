"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isEmailVerified } from "@/lib/auth/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
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
      setStatus("ready");
      return;
    }

    if (!isEmailVerified(user)) {
      setStatus("ready");
      return;
    }

    const { error } = await supabase.rpc("ensure_user_setup");

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }

    await queryClient.invalidateQueries();
    setStatus("ready");
  };

  useEffect(() => {
    runBootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-stone-500 text-sm">Setting up your desk…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-stone-700 font-medium">Could not set up your account</p>
        <p className="text-sm text-stone-500 max-w-md">{errorMsg}</p>
        <p className="text-xs text-stone-400 max-w-md">
          Run migration{" "}
          <code className="bg-stone-100 px-1 rounded">
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
