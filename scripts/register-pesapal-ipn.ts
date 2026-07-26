import "dotenv/config";
import { registerIpn } from "../lib/pesapal";

/**
 * One-time setup per environment: registers this deployment's IPN endpoint
 * with Pesapal and prints the ipn_id to store as PESAPAL_IPN_ID.
 *
 * Usage: pnpm tsx scripts/register-pesapal-ipn.ts https://your-domain.com/api/payments/pesapal/ipn
 */
async function main() {
  const url = process.argv[2];

  if (!url) {
    throw new Error(
      "Usage: tsx scripts/register-pesapal-ipn.ts <ipn-url>\n" +
        "Example: tsx scripts/register-pesapal-ipn.ts https://deperfumeshop.com/api/payments/pesapal/ipn"
    );
  }

  const ipnId = await registerIpn(url, "GET");

  console.log(`Registered IPN URL: ${url}`);
  console.log(`Set this in your environment as PESAPAL_IPN_ID=${ipnId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
