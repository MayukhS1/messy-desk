import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted">
            Your messy desk at a glance
          </p>
        </div>
        <Link href="/room">
          <Button size="lg">Enter Room</Button>
        </Link>
      </div>
      <DashboardContent />
    </div>
  );
}
