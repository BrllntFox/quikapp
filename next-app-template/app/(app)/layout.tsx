import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
  <main>
    <div className="flex-1 h-screen">
      {children}
    </div>
    <Toaster richColors />
  </main>)
}