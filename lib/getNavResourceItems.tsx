export function getNavResourceItems(resourceItemsRes: string | undefined) {
  return (
    resourceItemsRes
      ? JSON.parse(resourceItemsRes).map((e) => JSON.parse(e))
      : []
  ) as {
    title: string;
    subtitle: string;
    url: string;
  }[];
}
