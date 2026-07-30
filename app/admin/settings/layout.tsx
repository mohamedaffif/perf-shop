import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminRole } from "@/lib/auth/roles";

export default async function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!isAdminRole(session?.user?.role)) {
    redirect("/admin");
  }

  return <>{children}</>;
}
