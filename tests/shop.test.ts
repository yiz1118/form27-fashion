import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../data/products";
import { filterProducts, filtersToParams, parseFilters } from "../lib/shop";
import { addItem, restoreCart, setQuantity, subtotal } from "../lib/cart";

test("eight complete products have five views and stable available variants", () => {
  assert.equal(products.length, 8);
  assert.equal(new Set(products.map(product => product.slug)).size, 8);
  for (const product of products) {
    assert.deepEqual(product.gallery.map(image => image.view), ["front", "back", "detail", "fabric", "worn"]);
    assert.equal(product.variants.length, 5);
    assert.ok(product.gallery.every(image => image.color === product.color));
    assert.ok(product.variants.every(variant => variant.color === product.color));
    assert.ok(product.priceCents > 0 && Number.isInteger(product.priceCents));
  }
});

test("filters use OR within groups, AND across groups and preserve URL state", () => {
  const params = new URLSearchParams("category=Pants&category=Jackets&color=Chalk&size=M&max=200&sort=price-desc");
  const filters = parseFilters(params);
  assert.deepEqual(filterProducts(filters).map(product => product.slug), ["fold-trouser"]);
  const roundTrip = parseFilters(filtersToParams(filters));
  assert.deepEqual(roundTrip, filters);
  assert.deepEqual(filterProducts(parseFilters(new URLSearchParams("category=Pants&color=Citron"))), []);
  assert.deepEqual(filterProducts(parseFilters(new URLSearchParams("sort=price-asc")))[0].slug, "base-tee");
});

test("cart restores only valid available variants and merges quantities", () => {
  assert.deepEqual(restoreCart("broken"), []);
  assert.deepEqual(restoreCart("{}"), []);
  const valid = products[0].variants.find(variant => variant.size === "M")!;
  const unavailable = products[0].variants.find(variant => variant.size === "XS")!;
  const restored = restoreCart(JSON.stringify([{ variantId: valid.id, quantity: 2 }, { variantId: valid.id, quantity: 1 }, { variantId: unavailable.id, quantity: 5 }, { variantId: "missing", quantity: 1 }]));
  assert.deepEqual(restored, [{ variantId: valid.id, quantity: 3 }]);
  assert.equal(subtotal(restored), products[0].priceCents * 3);
  assert.deepEqual(addItem(restored, valid.id), [{ variantId: valid.id, quantity: 4 }]);
  assert.deepEqual(addItem(restored, unavailable.id), restored);
  assert.deepEqual(setQuantity(restored, valid.id, 0), []);
});
