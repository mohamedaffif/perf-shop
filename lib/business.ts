/**
 * Single source of truth for the business's public contact / legal details.
 * Used by the contact page, the legal pages, and email templates.
 */
export const BUSINESS = {
  name: "DE PERFUME SHOP",
  /** Registered / legal entity name — used in the legal pages. */
  legalName: "DE PERFUME SHOP",
  addressLines: ["Broadwalk Mall, Ojija Road", "Westlands, Nairobi", "Kenya"],
  /** As displayed. */
  phone: "0790 979930",
  /** For `tel:` links. */
  phoneE164: "+254790979930",
  /** For `wa.me/` links — digits only, no `+`. */
  whatsapp: "254790979930",
  /** TODO: confirm this mailbox exists on the live domain. */
  email: "hello@deperfumeshop.co.ke",
  socials: {
    instagram: "https://instagram.com/de_perfumeshop",
    facebook: "https://www.facebook.com/share/1HSavCJgfy/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@deperfumeshop",
    twitter: "https://x.com/deperfumeshop07",
  },
} as const;

export const BUSINESS_ADDRESS_ONELINE = BUSINESS.addressLines.join(", ");
