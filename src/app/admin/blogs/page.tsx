import { accessPage, withAuthorizationPermission, verifySession } from '@/actions/permissions';
import { Card } from '@/components/ui/card';
import React from 'react'
import AddRouteButton from '@/components/my/button/add-route-button';
import ListBlogs from './_component/list-blogs';

const AddBlog = async () => {

  const session = await verifySession()

  if (session.status !== 200 || !session || !session.data.user || !session.data.user.id) {
    return null;
  }
  await accessPage(['blogs_view'], session.data.user.id);
  const hasPermissionAdd = await withAuthorizationPermission(['blogs_create'], session.data.user.id);

  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-2'>
        {hasPermissionAdd.data.hasPermission && <AddRouteButton translationName="Blogs" translationButton="addblog" route="/admin/blogs/blog" />}
        <ListBlogs />
      </div>
    </Card>
  )
}

export default AddBlog
