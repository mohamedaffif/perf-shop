"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ALL_VALUE } from "@/lib/shop-filters";

interface UseQueryParamFilterOptions {
  resetParams?: string[];
}

export function useQueryParamFilter(options: UseQueryParamFilterOptions = {}) {
  const resetParams = options.resetParams ?? ["page"];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function getParam(key: string): string {
    return searchParams.get(key) ?? ALL_VALUE;
  }

  function setParams(entries: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(entries)) {
      if (value === undefined || value === ALL_VALUE) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    resetParams.forEach((key) => params.delete(key));

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setParam(key: string, value: string) {
    setParams({ [key]: value });
  }

  return { searchParams, getParam, setParam, setParams };
}
