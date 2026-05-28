import { AppBootstrap } from "@/components/AppBootstrap";
import { AppShell } from "@/components/AppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <AppBootstrap>{children}</AppBootstrap>
    </AppShell>
  );
}
