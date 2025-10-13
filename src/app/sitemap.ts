// app/sitemap.ts (ou app/sitemap.js)
import { MetadataRoute } from 'next';

// ⚠️ Assurez-vous d'utiliser votre URL de base (domaine)
const BASE_URL = 'https://aimen-blog.com'; 

// Fonction asynchrone pour récupérer les données de vos articles de blog
async function getBlogPosts() {
    // 💡 REMPLACEZ CECI par votre propre logique de récupération de données
    // (ex: appel à une API, base de données, CMS comme Sanity/Strapi, etc.)
    try {
        const response = await fetch(BASE_URL+'/api/sitemap/blogs', {
            // Optionnel : revalidation pour garder le sitemap frais. 
            // Par exemple, toutes les heures (3600 secondes).
            next: {
                revalidate: 60 
            }
        });
        
        // Assurez-vous que le format de la donnée est correct et correspond à ce que vous retournez
        // Cet exemple suppose que vous récupérez un tableau d'objets avec un `slug` et une `updated_at`
        const posts = await response.json(); 
        return posts; // Ex: [{ slug: 'mon-premier-post', updated_at: '2025-10-10' }, ...]
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}


async function getProjectPosts() {
    // 💡 REMPLACEZ CECI par votre propre logique de récupération de données
    // (ex: appel à une API, base de données, CMS comme Sanity/Strapi, etc.)
    try {
        const response = await fetch(BASE_URL+'/api/sitemap/projects', {
            // Optionnel : revalidation pour garder le sitemap frais. 
            // Par exemple, toutes les heures (3600 secondes).
            next: {
                revalidate: 60 
            }
        });
        
        // Assurez-vous que le format de la donnée est correct et correspond à ce que vous retournez
        // Cet exemple suppose que vous récupérez un tableau d'objets avec un `slug` et une `updated_at`
        const posts = await response.json(); 
        return posts; // Ex: [{ slug: 'mon-premier-post', updated_at: '2025-10-10' }, ...]
    } catch (error) {
        console.error('Failed to fetch project posts:', error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    
    // 1. Récupérer les articles dynamiques
    const blogPosts = await getBlogPosts();

    // 2. Mapper les articles de blog pour le format sitemap
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post:any) => ({
        // UTILISATION DE encodeURIComponent POUR ÉVITER LES ERREURS XML (ex: avec le caractère '&')
        url: `${BASE_URL}/blogs/${encodeURIComponent(post.slug)}`, 
        lastModified: new Date(post.updated_at).toISOString(), // Utilisez la date de dernière modification
        changeFrequency: 'weekly', // Fréquence de changement (optional)
        priority: 0.7, // Priorité (optional)
    }));


    const projectPosts = await getProjectPosts();

    // 2. Mapper les articles de blog pour le format sitemap
    const projectRoutes: MetadataRoute.Sitemap = projectPosts.map((post:any) => ({
        // UTILISATION DE encodeURIComponent POUR ÉVITER LES ERREURS XML (ex: avec le caractère '&')
        url: `${BASE_URL}/projects/${encodeURIComponent(post.slug)}`,
        lastModified: new Date(post.updated_at).toISOString(), // Utilisez la date de dernière modification
        changeFrequency: 'weekly', // Fréquence de changement (optional)
        priority: 0.7, // Priorité (optional)
    }));
    
    // 3. Définir les routes statiques
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/about`, // Exemple de page statique
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`, // Autre exemple de page statique
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/blogs`, // Autre exemple de page statique
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/projects`, // Autre exemple de page statique
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 0.5,
        },
        // Ajoutez ici toutes vos autres pages statiques
    ];

    // 4. Combiner et retourner toutes les routes
    return [
        ...staticRoutes,
        ...blogRoutes,
        ...projectRoutes
    ];
}
