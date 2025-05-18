import { prisma } from '@/lib/db';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Récupérer les articles depuis ta source de données
  const blogs = await prisma.blog.findMany({});
  const projects = await prisma.project.findMany({});

  // Générer les entrées pour les articles
  const blogEntries: MetadataRoute.Sitemap = blogs.map(({ slug, created_at }) => ({
    url: `https://aimen-blog.com/blogs/${slug}`,
    lastModified: new Date(created_at),
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map(({ slug, created_at }) => ({
    url: `https://aimen-blog.com/projects/${slug}`,
    lastModified: new Date(created_at),
  }));

  // Retourner le sitemap complet
  return [
    { url: `https://aimen-blog.com/` },
    { url: `https://aimen-blog.com/contact` },
    { url: `https://aimen-blog.com/about` },
    { url: `https://aimen-blog.com/blogs` },
    { url: `https://aimen-blog.com/projects` },
    ...blogEntries,
    ...projectEntries,
  ];
}
