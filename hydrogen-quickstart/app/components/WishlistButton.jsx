import { useFetcher } from "@remix-run/react";

export default function WishlistButton({ productId, isWishlisted }) {
  const fetcher = useFetcher();

  function toggleWishlist() {
    fetcher.submit(
      { productId },
      { method: "post", action: "/wishlist" }
    );
  }

  return (
    <button onClick={toggleWishlist}>
      {isWishlisted ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
    </button>
  );
}
