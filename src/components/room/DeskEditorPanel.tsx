"use client";

import Link from "next/link";
import { useMyDesk } from "@/lib/hooks/useDesk";
import { DeskCanvas } from "@/components/desk/DeskCanvas";
import { DeskEditorGrid } from "@/components/desk/DeskEditorGrid";
import { Button } from "@/components/ui/Button";

export function DeskEditorPanel({ compact }: { compact?: boolean }) {
  const { data, isLoading } = useMyDesk();
  const items = data?.items ?? [];
  const status = data?.desk?.status ?? "draft";

  if (isLoading) {
    return <div className="h-[420px] animate-pulse rounded-xl bg-stone-100 lg:h-[520px]" />;
  }

  if (!data?.desk) {
    return <p className="text-stone-500">No desk found.</p>;
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Your desk</h3>
            <p className="text-xs text-stone-500">
              Read-only preview ·{" "}
              <span className="capitalize">{status}</span>
            </p>
          </div>
          <Link href="/desk/edit" className="w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto">
              Edit desk
            </Button>
          </Link>
        </div>

        <DeskEditorGrid
          desk={<DeskCanvas items={items} mode="view" />}
          sidebar={
            <div className="hidden lg:flex flex-col gap-3 pt-2 text-sm text-stone-500">
              <p>
                Arrange items, write hidden messages, and pick hunt targets in
                the full editor.
              </p>
              <ul className="space-y-2 text-xs">
                <li className="rounded-lg bg-stone-50 px-3 py-2 border border-stone-100">
                  Tap <strong className="text-stone-700">Edit desk</strong> to
                  make changes
                </li>
                <li className="rounded-lg bg-stone-50 px-3 py-2 border border-stone-100">
                  Publish when you&apos;re ready for your partner to hunt
                </li>
              </ul>
            </div>
          }
        />
      </div>
    );
  }

  return null;
}
