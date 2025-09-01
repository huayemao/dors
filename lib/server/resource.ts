import prisma from '@/lib/prisma'
import { getNavResourceItems } from '../isomorphic/getNavResourceItems';
import { unstable_cache } from 'next/cache';


export const getResourceItems = unstable_cache(async function () {
  const resourceItemsRes = (
    await prisma.settings.findFirst({ where: { key: "nav_resource" } })
  )?.value;
  const resourceItems = getNavResourceItems(resourceItemsRes as string[]);
  return resourceItems;
}, ['settings', 'nav_resource'], { tags: ['settings_nav_resource'] })
