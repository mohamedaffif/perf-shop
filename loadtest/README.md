# Load tests (k6)

Two [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) scripts for measuring what the
production server can handle before launch. They generate traffic; they don't run in CI or in
the app image.

| Script        | What it simulates                                                 | Writes data?                   |
| ------------- | ----------------------------------------------------------------- | ------------------------------ |
| `browse.js`   | Anonymous shoppers: home, shop, categories, product pages, search | No — read-only                 |
| `checkout.js` | Signed-in shoppers opening checkout and placing orders            | **Yes — orders, stock, email** |

## Before you run anything

- **Test the real target.** Run against the 2 vCPU / 8 GB server, with the latest images and
  `NEXT_PUBLIC_SHOP_LIVE=true` (in teaser mode, catalog pages redirect and every check fails).
  Numbers from a laptop or the old server don't transfer.
- **Run k6 from a different machine** than the server, or the load generator steals the CPU
  you're measuring.
- **Hit the server directly, not through Cloudflare** (Cloudflare would absorb or rate-limit
  the traffic). A DNS-only test hostname pointing at the server works, e.g.
  `origin-test.<your-domain>` set as `SITE_ADDRESS` so Caddy gets a certificate for it.
- All requests come from one IP, so per-IP rate limits (login, newsletter, contact) apply to
  the whole test. The scripts avoid those endpoints except sign-in, once per test account.

## Browse test (safe)

```sh
k6 run -e BASE_URL=https://origin-test.example.com loadtest/browse.js
```

It ramps to `PEAK_RATE` page views per second (default 100, which is about 200–250 HTTP
requests per second), holds that for 5 minutes, then ramps down. The whole run takes about 9
minutes.

| Variable       | Default             | Meaning                                                |
| -------------- | ------------------- | ------------------------------------------------------ |
| `BASE_URL`     | `https://localhost` | Server to test                                         |
| `PEAK_RATE`    | `100`               | Page views per second at peak                          |
| `MAX_VUS`      | `500`               | Maximum concurrent virtual users k6 may start          |
| `PRODUCT_IDS`  | all published       | Comma-separated product ids to visit                   |
| `INSECURE_TLS` | unset               | `1` to accept a self-signed certificate (local Docker) |

To try the script against the local Docker stack (to check that it works, not to get real
numbers), run:
`k6 run -e INSECURE_TLS=1 -e PEAK_RATE=10 loadtest/browse.js`

## Checkout test (writes real data)

Every successful iteration **creates a real order, decrements stock, and queues confirmation
emails**. Run it against a database copy, or plan to clean up afterwards:

- Use dedicated test accounts (e.g. `loadtest+1@…`), so the test orders are easy to find by
  email.
- Point `PRODUCT_IDS` at a test product with a large stock, so real products aren't sold out.
- Payment defaults to `COD`, so the test measures your server rather than Pesapal. Set
  `PAYMENT_METHOD=PESAPAL` only against the Pesapal **sandbox**.
- Before you start, sign in once in a browser at `BASE_URL` to confirm that sign-in works on
  that hostname.

```sh
k6 run \
  -e BASE_URL=https://origin-test.example.com \
  -e LOADTEST_USERS="loadtest+1@example.com:pw1,loadtest+2@example.com:pw2,..." \
  -e PRODUCT_IDS=clx_test_product_id \
  -e ORDERS_PER_MINUTE=20 \
  loadtest/checkout.js
```

The orders API allows 20 orders per user per 10 minutes (2 per minute), so `ORDERS_PER_MINUTE`
needs at least `ORDERS_PER_MINUTE / 2` test accounts. The script refuses to start with too
few. Increase `ORDERS_PER_MINUTE` over successive runs to find the checkout ceiling.

| Variable            | Default | Meaning                                             |
| ------------------- | ------- | --------------------------------------------------- |
| `LOADTEST_USERS`    | —       | `email:password` pairs, comma-separated             |
| `ORDERS_PER_MINUTE` | `20`    | Order rate to sustain                               |
| `DURATION`          | `5m`    | How long to sustain it                              |
| `PAYMENT_METHOD`    | `COD`   | `COD`, `BANK_TRANSFER`, or `PESAPAL` (sandbox only) |
| `PRODUCT_IDS`       | all     | Products to order (use a high-stock test product)   |

## Reading the results

k6 prints a summary at the end, and each threshold is marked ✓ or ✗. The pass criteria from
the scaling plan are:

- **Browse:** p95 response time under 500 ms, failed requests under 1%, checks over 99%.
- **Checkout:** p95 under 2 s for placing an order. The more useful result is the order rate
  at which errors or latency start climbing.

The per-page lines (`{name:product}`, `{name:shop}`, …) show which page is the bottleneck.

While the test runs, watch the server itself. The server is the more useful half of the data:

```sh
docker stats                                                    # CPU/memory per container
docker compose exec redis redis-cli INFO stats | grep -E "evicted_keys|keyspace_(hits|misses)"
docker compose exec rabbitmq rabbitmqctl list_queues name messages
```

Also check database CPU and connections in the Supabase dashboard. `evicted_keys` should stay
at 0, and queue depth should drain back to 0 after the run.
