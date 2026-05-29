import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted">
          Your messy desk at a glance
        </p>
      </div>
      <DashboardContent />
    </div>
  );
}
