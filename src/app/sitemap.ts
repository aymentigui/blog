import { prisma } from '@/lib/db';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Récupérer les articles depuis ta source de données
  const blogs = await prisma.blog.findMany({});
  const projects = await prisma.project.findMany({});

  // Générer les entrées pour les articles
  const blogEntries: MetadataRoute.Sitemap = blogs.map(({ slug, created_at }) => ({
    url: `${process.env.DOMAIN_URL}/blogs/${slug}`,
    lastModified: new Date(created_at),
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map(({ slug, created_at }) => ({
    url: `${process.env.DOMAIN_URL}/projects/${slug}`,
    lastModified: new Date(created_at),
  }));

  // Retourner le sitemap complet
  return [
    { url: `${process.env.DOMAIN_URL}/` },
    { url: `${process.env.DOMAIN_URL}/contact` },
    { url: `${process.env.DOMAIN_URL}/about` },
    { url: `${process.env.DOMAIN_URL}/blogs` },
    { url: `${process.env.DOMAIN_URL}/projects` },
    ...blogEntries,
    ...projectEntries,
  ];
}
