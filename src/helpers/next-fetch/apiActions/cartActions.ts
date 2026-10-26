"use server";

import { nextFetch } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";
import type { CartData, AddToCartPayload } from "@/types";

/** GET /cart — fetch authenticated user's cart & price breakdown */
export async function getCart() {
  const result = await nextFetch<CartData>("/cart", {
    method: "GET",
    cache: "force-cache",
    tags: ["cart"],
  });
  return result;
}

/** POST /cart — add product to cart with variant (size & color) */
export async function addToCart(body: AddToCartPayload) {
  const result = await nextFetch<CartData>("/cart", {
    method: "POST",
    body,
  });

  if (result.success) {
    await revalidateTags(["cart"]);
  }

  return result;
}

/** PATCH /cart/:cartId — adjust quantity (+1 or -1) */
export async function updateCartQuantity(cartId: string, quantity: 1 | -1) {
  const result = await nextFetch<CartData>(`/cart/${cartId}`, {
    method: "PATCH",
    body: { quantity },
  });

  if (result.success) {
    await revalidateTags(["cart"]);
  }

  return result;
}

/** DELETE /cart/:cartId — remove single line item */
export async function removeCartItem(cartId: string) {
  const result = await nextFetch<null>(`/cart/${cartId}`, {
    method: "DELETE",
  });

  if (result.success) {
    await revalidateTags(["cart"]);
  }

  return result;
}

/** DELETE /cart/clear — clear entire cart */
export async function clearCart() {
  const result = await nextFetch<null>("/cart/clear", {
    method: "DELETE",
  });

  if (result.success) {
    await revalidateTags(["cart"]);
  }

  return result;
}
