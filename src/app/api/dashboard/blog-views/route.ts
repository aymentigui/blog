import { verifySession } from '@/actions/permissions';
import { prisma } from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  try {

    const e = await getTranslations('Error');
    const session = await verifySession()

    if (!session || session.status != 200) {
      return NextResponse.json({ message: e('unauthorized') }, { status: 401 })
    }

    if (!session.data.user || !session.data.user.isAdmin) {
      return NextResponse.json({ message: e('forbidden') }, { status: 403 })
    }

    const { searchParams } = new URL(request.url);
    const timeFilter = searchParams.get('timeFilter') || 'all';

    // Create date filter based on the timeFilter
    let dateFilter = {};
    const now = new Date();

    switch (timeFilter) {
      case 'today':
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        dateFilter = {
          viewed_at: {
            gte: startOfDay
          }
        };
        break;
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        dateFilter = {
          viewed_at: {
            gte: startOfWeek
          }
        };
        break;
      case 'month':
        const startOfMonth = new Date(now);
        startOfMonth.setMonth(now.getMonth() - 1);
        dateFilter = {
          viewed_at: {
            gte: startOfMonth
          }
        };
        break;
      case 'year':
        const startOfYear = new Date(now);
        startOfYear.setFullYear(now.getFullYear() - 1);
        dateFilter = {
          viewed_at: {
            gte: startOfYear
          }
        };
        break;
      default:
        // 'all' - no filter
        dateFilter = {};
    }

    // First get blog view counts with filter
    const blogViews = await prisma.blogs_view.groupBy({
      by: ['blog_id'],
      _count: {
        blog_id: true
      },
      where: dateFilter
    });

    // Get blog titles to join with view data
    const blogs = await prisma.blog.findMany({
      where: {
        deleted_at: null,
        id: {
          in: blogViews.map(view => view.blog_id)
        }
      },
      include: {
        titles: {
          where: {
            language: 'en' // Default to English titles
          },
          take: 1
        }
      }
    });

    // Create a map of blog IDs to titles
    const blogTitlesMap = new Map();
    blogs.forEach(blog => {
      const title = blog.titles.length > 0 ? blog.titles[0].title : blog.slug;
      blogTitlesMap.set(blog.id, title);
    });

    // Format data for the chart
    const formattedData = blogViews.map(item => ({
      id: item.blog_id,
      title: blogTitlesMap.get(item.blog_id) || `Blog ${item.blog_id.substring(0, 8)}...`,
      views: item._count.blog_id
    }));

    // Sort by view count descending
    formattedData.sort((a, b) => b.views - a.views);

    // Limit to top 10 blogs
    return NextResponse.json(formattedData.slice(0, 10));
  } catch (error) {
    console.error('Error fetching blog views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog views' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}