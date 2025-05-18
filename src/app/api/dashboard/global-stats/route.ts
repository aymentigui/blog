import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession } from '@/actions/permissions';
import { getTranslations } from 'next-intl/server';


export async function GET() {
  try {

    const e = await getTranslations('Error');
    const session = await verifySession()

    if (!session || session.status != 200) {
      return NextResponse.json({ message: e('unauthorized') }, { status: 401 })
    }

    if (!session.data.user || !session.data.user.isAdmin) {
      return NextResponse.json({ message: e('forbidden') }, { status: 403 })
    }

    // Fetch all required counts in parallel
    const [
      blogCount,
      projectCount,
      commentCount,
      blogCategoriesCount,
      projectCategoriesCount
    ] = await Promise.all([
      prisma.blog.count({
        where: { deleted_at: null }
      }),
      prisma.project.count({
        where: { deleted_at: null }
      }),
      prisma.comment.count({
        where: { deleted_at: null }
      }),
      prisma.blogs_categories.count(),
      prisma.project_categories.count()
    ]);

    return NextResponse.json({
      blogCount,
      projectCount,
      commentCount,
      blogCategoriesCount,
      projectCategoriesCount
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}