import prisma from '@/lib/prisma'
import { getNavResourceItems } from '../getNavResourceItems';

export async function getResourceItems() {
  const resourceItemsRes = (
    await prisma.settings.findFirst({ where: { key: "nav_resource" } })
  )?.value;
  const resourceItems = getNavResourceItems(resourceItemsRes as string[]);
  return resourceItems;
}
