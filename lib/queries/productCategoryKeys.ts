export const productCategoryKeys = {
  all: ["product-categories"] as const,
  lists: () => [...productCategoryKeys.all, "list"] as const,
  list: () => [...productCategoryKeys.lists()] as const,
};
