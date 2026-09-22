# Future Development

Backlog of features considered but intentionally deferred.

## Product review system

The product page previously showed a hardcoded `4.9` rating and `128 reviews`
placeholder, and the homepage had a "What Our Customers Say" section with
three made-up names and quotes (`Testimonials.jsx`, deleted). Neither was
backed by real data — both removed until this exists for real. They should
be built as ONE system, not two: the homepage testimonials are just a
curated subset of the same reviews that back the product-page rating.

How it should work end to end:
- A `reviews` table (Supabase) linked to `orders`/`product_variants`, so
  only a customer with a completed order for that item can review it
- Entry point: a "Leave a Review" prompt on the My Orders page (or a
  post-delivery email link) for each order line, auth-gated — this is
  *where* a real customer would actually submit one, not a public form
  anyone can fill in
- Submission form: star rating + text, tied to the order + variant
- Backend validation + basic moderation (admin can hide/unhide a review
  before it's public — needed since it's unmoderated user content)
- Product page: aggregate rating (average) + review count computed live
  from approved rows for that variant, replacing the old hardcoded numbers
- Homepage testimonials: admin marks specific approved reviews as
  "featured," or it auto-selects the highest-rated ones with real text —
  either way, sourced from the same table, never hardcoded again
