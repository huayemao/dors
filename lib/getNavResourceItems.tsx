export function getNavResourceItems(resourceItemsRes: string[] | undefined) {
  if (typeof resourceItemsRes == "string") {
    resourceItemsRes = JSON.parse(resourceItemsRes);
  }
  return (
    resourceItemsRes ? resourceItemsRes.map((e) => JSON.parse(e)) : []
  ) as {
    title: string;
    subtitle: string;
    url: string;
  }[];
}
