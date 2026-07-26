import { getStoreSettings } from "@/domain/settings";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <CheckoutPageClient
      pesapalEnabled={settings.pesapalEnabled}
      codEnabled={settings.codEnabled}
      bankTransferEnabled={settings.bankTransferEnabled}
    />
  );
}
