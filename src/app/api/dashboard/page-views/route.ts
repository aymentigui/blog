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

    // Get page views with filter
    const pageViews = await prisma.page_view.groupBy({
      by: ['page'],
      _count: {
        page: true
      },
      where: dateFilter
    });

    // Format data for the chart
    const formattedData = pageViews.map(item => ({
      page: item.page,
      views: item._count.page
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching page views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page views' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}