export function buildShopUrl(
  origin: string,
  locale: string,
  clinicId: string,
  productId: string
) {
  return `${origin}/${locale}/shop/${clinicId}/${productId}`;
}
