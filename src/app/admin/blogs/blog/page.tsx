import { accessPage, verifySession } from '@/actions/permissions';
import { Card } from '@/components/ui/card';
import React from 'react'
import AddBlogForm from '../_component/forms/add-edit-blog';
import { getBlogsCategories } from '@/actions/blog/categories/get';


const AddBlog = async () => {

  const session = await verifySession()

  if (session.status !== 200 || !session || !session.data.user || !session.data.user.id) {
    return null;
  }
  await accessPage(['blogs_create'], session.data.user.id);

  const res = await getBlogsCategories()
  let categories = [];
  if(res.status === 200 && res.data)
    categories = res.data

  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-2 '>
        <AddBlogForm isAdd={true} categories={categories} />
      </div>
    </Card>
  )
}

export default AddBlog
