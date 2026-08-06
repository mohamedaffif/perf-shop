import { auth } from "@/auth";
import { getStoreSettings } from "@/domain/settings";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export default async function CheckoutPage() {
  const [session, settings] = await Promise.all([auth(), getStoreSettings()]);

  return (
    <CheckoutPageClient
      pesapalEnabled={settings.pesapalEnabled}
      codEnabled={settings.codEnabled}
      bankTransferEnabled={settings.bankTransferEnabled}
      initialEmail={session?.user?.email ?? ""}
      initialFullName={session?.user?.name ?? ""}
    />
  );
}
