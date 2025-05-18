import { accessPage, verifySession } from '@/actions/permissions';
import { getProjectsCategories } from '@/actions/project/categories/get';
import { Card } from '@/components/ui/card';
import React from 'react'
import AddProjectForm from '../_component/forms/add-project';


const AddProject = async () => {

  const session = await verifySession()

  if (session.status !== 200 || !session || !session.data.user || !session.data.user.id) {
    return null;
  }
  await accessPage(['projects_create'], session.data.user.id);

  const res = await getProjectsCategories()
  let categories = [];
  if(res.status === 200 && res.data)
    categories = res.data

  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-2 '>
        <AddProjectForm isAdd={true} categories={categories} />
      </div>
    </Card>
  )
}

export default AddProject
