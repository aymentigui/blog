import { accessPage, withAuthorizationPermission, verifySession } from '@/actions/permissions';
import { Card } from '@/components/ui/card';
import React from 'react'
import AddRouteButton from '@/components/my/button/add-route-button';
import ListProjects from './_component/list-projects';

const PageProjects = async () => {

  const session = await verifySession()

  if (session.status !== 200 || !session || !session.data.user || !session.data.user.id) {
    return null;
  }
  await accessPage(['projects_view'], session.data.user.id);
  const hasPermissionAdd = await withAuthorizationPermission(['projects_create'], session.data.user.id);

  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-2'>
        {hasPermissionAdd.data.hasPermission && <AddRouteButton translationName="Projects" translationButton="addproject" route="/admin/projects/project" />}
        <ListProjects />
      </div>
    </Card>
  )
}

export default PageProjects
