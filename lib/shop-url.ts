export type ShopPartner = "clinic" | "influencer" | "storefront";

export function shopProductPath(
  partner: ShopPartner,
  partnerId: string,
  productId: string
) {
  if (partner === "storefront") {
    return `/storefront/${productId}`;
  }
  const segment =
    partner === "influencer" ? `influencer/${partnerId}` : partnerId;
  return `/shop/${segment}/${productId}`;
}

export function buildShopUrl(
  origin: string,
  locale: string,
  partnerId: string,
  productId: string,
  partner: ShopPartner = "clinic"
) {
  return `${origin}/${locale}${shopProductPath(partner, partnerId, productId)}`;
}
