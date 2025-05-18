import { accessPage, withAuthorizationPermission,verifySession} from '@/actions/permissions';
import AddModalButton from '@/components/my/button/add-modal-button';
import { Card } from '@/components/ui/card';
import { useAddUpdateBlogsCategoryDialog } from '@/context/add-update-blogs-category-dialog-context';
import React from 'react'
import BlogsCategoriesPageList from '../_component/list-blogs-categories';
import { getBlogsCategories } from '@/actions/blog/categories/get';

const ProductsCategoriesPage = async () => {

  const session = await verifySession()

  if (session.status !== 200 || !session || !session.data.user || !session.data.user.id) {
    return null;
  }
  await accessPage(['blogs_categories_view'],session.data.user.id);
  const hasPermissionView = await withAuthorizationPermission(['blogs_categories_view'],session.data.user.id);
  const hasPermissionAdd = await withAuthorizationPermission(['blogs_categories_create'],session.data.user.id);

  let categories=[]
  if(hasPermissionView){
    const res= await getBlogsCategories()
    if(res.status===200 && res.data)
      categories=res.data
  }

  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-2'>
        {hasPermissionAdd.data.hasPermission && <AddModalButton translationName="BlogsCategories" translationButton="addcategory" useModal={useAddUpdateBlogsCategoryDialog} />}
        {hasPermissionView.data.hasPermission && <BlogsCategoriesPageList data={categories} />}
      </div>
    </Card>
  )
}

export default ProductsCategoriesPage
