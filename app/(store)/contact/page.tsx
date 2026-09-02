import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Typography } from "@/components/ui/typography";
import { ContactForm } from "@/components/contact/ContactForm";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with DE PERFUME SHOP.",
};

export default function ContactPage() {
  type Channel = { icon: typeof Mail; label: string; href: string };
  const channels: Channel[] = [
    { icon: Mail, label: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
    { icon: Phone, label: BUSINESS.phone, href: `tel:${BUSINESS.phoneE164}` },
    {
      icon: MessageCircle,
      label: "Message us on WhatsApp",
      href: `https://wa.me/${BUSINESS.whatsapp}`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbPage>Contact</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Typography variant="h1">Get in touch</Typography>
          <p className="text-muted-foreground max-w-md text-sm">
            Questions about the collection, stockists, or your order? Send us a note and we&apos;ll
            reply as soon as we can.
          </p>

          <ul className="mt-2 flex flex-col gap-3">
            {channels.map((channel) => (
              <li key={channel.href}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                  className="text-foreground hover:text-primary inline-flex items-center gap-3 text-sm transition-colors"
                >
                  <channel.icon className="size-4" />
                  {channel.label}
                </a>
              </li>
            ))}
            <li className="text-muted-foreground inline-flex items-start gap-3 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                {BUSINESS.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>

        <div className="max-w-md">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
