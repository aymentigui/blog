// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const revalidate = 3600; 

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const blogs = await prisma.blog.findMany({});
  const projects = await prisma.project.findMany({});

  const staticUrls = [
    '/',
    '/about',
    '/contact',
    '/blogs',
    '/projects',
  ];

  const urls = [
    ...staticUrls.map((url) => ({
      loc: `https://aimen-blog.com${url}`,
    })),
    ...blogs.map(({ slug, created_at }) => ({
      loc: `https://aimen-blog.com/blogs/${slug}`,
      lastmod: new Date(created_at).toISOString(),
    })),
    ...projects.map(({ slug, created_at }) => ({
      loc: `https://aimen-blog.com/projects/${slug}`,
      lastmod: new Date(created_at).toISOString(),
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }:any) => `
  <url>
    <loc>${escapeXml(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
