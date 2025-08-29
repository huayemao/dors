import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const robotsTxt = `User-agent: *
Allow: /

# 禁止访问私密内容
Disallow: /protected/
Disallow: /admin/
Disallow: /api/

# 允许访问公开内容
Allow: /posts/
Allow: /categories/
Allow: /tags/
Allow: /notes/
Allow: /quotes/
Allow: /qas/
Allow: /herbal/
Allow: /excel-renamer/
Allow: /video-splitter/
Allow: /dict-parser/
Allow: /kunming-living/

# Sitemap
Sitemap: /sitemap.xml

# 爬取延迟（可选）
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
