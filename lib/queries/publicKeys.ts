export const publicShopKeys = {
  all: ["publicShop"] as const,
  detail: (clinicId: string, productId: string) =>
    [...publicShopKeys.all, clinicId, productId] as const,
};

export const publicTrackKeys = {
  all: ["publicTrack"] as const,
  detail: (token: string) => [...publicTrackKeys.all, token] as const,
};
