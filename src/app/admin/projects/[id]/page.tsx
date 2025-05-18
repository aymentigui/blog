import { getProjectPublic } from '@/actions/project/get';
import { PreviewBuilderHtml } from '@/components/myui/elements-builder/preview-builder';
import { Card } from '@/components/ui/card';
import React from 'react'

const ProjectPreview = async (params : any) => {
    const paramsID = await params;

    if (!paramsID.id)
        return null

    const res = await getProjectPublic(paramsID.id)

    if (res.status !== 200)
        return null

    return (
        <Card className='p-4 flex flex-col gap-2'>
            {/* <div className='h-72 overflow-hidden'>
                <MyImage image={res.data.image} />
            </div>
            <div>
                <h1 className='text-2xl font-bold'>{res.data.titles[0].title}</h1>
                <p>{res.data.description[0].description}</p>
            </div> */}
            <div>
                {/* <div className='text-2xl font-bold'>Content</div> */}
                <div>
                    {res.data.contents.map((content: any) => (
                        <div key={content.id}>
                            <PreviewBuilderHtml id={content.id} type={content.type} value={JSON.parse(content.data)} />
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default ProjectPreview
