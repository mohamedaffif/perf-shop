import { auth } from "@/auth";
import { findById } from "@/domain/auth";
import { getStoreSettings } from "@/domain/settings";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export default async function CheckoutPage() {
  const [session, settings] = await Promise.all([auth(), getStoreSettings()]);
  const user = session?.user?.id ? await findById(session.user.id) : null;

  return (
    <CheckoutPageClient
      pesapalEnabled={settings.pesapalEnabled}
      codEnabled={settings.codEnabled}
      bankTransferEnabled={settings.bankTransferEnabled}
      initialEmail={session?.user?.email ?? ""}
      initialFullName={session?.user?.name ?? ""}
      initialPhone={user?.phone ?? ""}
    />
  );
}
