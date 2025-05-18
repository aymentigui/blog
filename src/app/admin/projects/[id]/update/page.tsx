import { verifySession, withAuthorizationPermission } from '@/actions/permissions';
import { Card } from '@/components/ui/card';
import React from 'react'
import { getProject } from '@/actions/project/get';
import { getProjectsCategories } from '@/actions/project/categories/get';
import AddProjectForm from '../../_component/forms/add-project';


const UpdateProject = async ({params} : any ) => {

    const paramsID = await params
    
    if (!paramsID.id)
        return null
    const session = await verifySession()

    if (session.status !== 200 || !session || !session.data.user || !session.data.user.id) {
        return null;
    }

    const res= await getProject(paramsID.id)
    if(res.status !== 200) return null
    
    
    const hasPermissionUpdate = await withAuthorizationPermission(['projects_update'], session.data.user.id);

    if ((hasPermissionUpdate.status !== 200 || !hasPermissionUpdate.data.hasPermission) &&  res.data.createdBy !== session.data.user.id) {
        return null;
    }

    const resCategories = await getProjectsCategories()
    let categories = [];
    if(resCategories.status === 200 && resCategories.data)
      categories = resCategories.data

    return (
        <Card className='p-4'>
            <div className='flex flex-col gap-2 '>
                <AddProjectForm isAdd={false} project={res.data} categories={categories} />
            </div>
        </Card>
    )
}

export default UpdateProject
