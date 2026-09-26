import { PHASE_PRODUCTION_BUILD } from "next/constants";

/**
 * True while `next build` prerenders pages. The Docker and CI builds run with
 * placeholder env (no reachable Postgres/Redis), so cached pages must skip
 * database reads at build time and let ISR fill them in on the first
 * revalidation after deploy.
 */
export const IS_BUILD_PHASE = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
