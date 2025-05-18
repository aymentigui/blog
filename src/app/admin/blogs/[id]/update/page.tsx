import { accessPage, verifySession, withAuthorizationPermission } from '@/actions/permissions';
import { Card } from '@/components/ui/card';
import React from 'react'
import AddBlogForm from '../../_component/forms/add-blog';
import { getBlog } from '@/actions/blog/get';
import { getBlogsCategories } from '@/actions/blog/categories/get';


const UpdateBlog = async ({params} : any) => {

    const paramsID = await params

    if (!paramsID.id)
        return null
    const session = await verifySession()

    if (session.status !== 200 || !session || !session.data.user || !session.data.user.id) {
        return null;
    }

    const res= await getBlog(paramsID.id)
    if(res.status !== 200) return null
    
    
    const hasPermissionUpdate = await withAuthorizationPermission(['blogs_update'], session.data.user.id);

    if ((hasPermissionUpdate.status !== 200 || !hasPermissionUpdate.data.hasPermission) &&  res.data.createdBy !== session.data.user.id) {
        return null;
    }

    const resCategories = await getBlogsCategories()
    let categories = [];
    if(resCategories.status === 200 && resCategories.data)
      categories = resCategories.data

    return (
        <Card className='p-4'>
            <div className='flex flex-col gap-2 '>
                <AddBlogForm isAdd={false} blog={res.data} categories={categories} />
            </div>
        </Card>
    )
}

export default UpdateBlog
