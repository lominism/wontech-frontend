export const publicShopKeys = {
  all: ["publicShop"] as const,
  detail: (partner: string, partnerId: string, productId: string) =>
    [...publicShopKeys.all, partner, partnerId, productId] as const,
};

export const publicTrackKeys = {
  all: ["publicTrack"] as const,
  detail: (token: string) => [...publicTrackKeys.all, token] as const,
};
