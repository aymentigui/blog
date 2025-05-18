import { accessPage, withAuthorizationPermission,verifySession} from '@/actions/permissions';
import { getProjectsCategories } from '@/actions/project/categories/get';
import AddModalButton from '@/components/my/button/add-modal-button';
import { Card } from '@/components/ui/card';
import React from 'react'
import ProjectsCategoriesPageList from '../_component/list-projects-categories';
import { useAddUpdateProjectsCategoryDialog } from '@/context/add-update-projects-category-dialog-context';

const ProductsCategoriesPage = async () => {

  const session = await verifySession()

  if (session.status !== 200 || !session || !session.data.user || !session.data.user.id) {
    return null;
  }
  await accessPage(['projects_categories_view'],session.data.user.id);
  const hasPermissionView = await withAuthorizationPermission(['projects_categories_view'],session.data.user.id);
  const hasPermissionAdd = await withAuthorizationPermission(['projects_categories_create'],session.data.user.id);

  let categories=[]
  if(hasPermissionView){
    const res= await getProjectsCategories()
    if(res.status===200 && res.data)
      categories=res.data
  }

  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-2'>
        {hasPermissionAdd.data.hasPermission && <AddModalButton translationName="ProjectsCategories" translationButton="addcategory" useModal={useAddUpdateProjectsCategoryDialog} />}
        {hasPermissionView.data.hasPermission && <ProjectsCategoriesPageList data={categories} />}
      </div>
    </Card>
  )
}

export default ProductsCategoriesPage
