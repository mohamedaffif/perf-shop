import type { z } from "zod";
import type { subscriberFiltersSchema } from "./newsletter.validator";
import type { Paginated } from "@/domain/pagination";

export interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  unsubscribedAt: Date | null;
  createdAt: Date;
}

export type SubscriberFilters = z.input<typeof subscriberFiltersSchema>;
export type ParsedSubscriberFilters = z.output<typeof subscriberFiltersSchema>;

export type PaginatedSubscribers = Paginated<Subscriber>;
