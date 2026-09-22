# Future Development

Backlog of features considered but intentionally deferred.

## Product review system

The product page previously showed a hardcoded `4.9` rating and `128 reviews`
placeholder with no real data behind it — removed until this exists for real.

To implement properly, this needs:
- A `reviews` table (Supabase) linked to `orders`/`product_variants`, so only
  customers who bought the item can review it
- A submission form on the order/product page (rating + text, auth-gated)
- Backend validation + basic moderation (e.g. admin can hide a review)
- Aggregate rating/count computed from real rows and displayed on the
  product page and shop grid
