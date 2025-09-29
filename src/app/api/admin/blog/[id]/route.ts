import { UpdateBlog } from "@/actions/blog/update";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: any }) {

    const paramsID = await params

    const data = await request.formData();
    let images = data.get("file") as unknown as File;
    const slug = data.get("slug") as string;
    const titles = JSON.parse(data.get("titles") as string);
    const descriptions = JSON.parse(data.get("descriptions") as string);
    const contents = JSON.parse(data.get("contents") as string);
    const files = data.getAll("files") as unknown as File[];
    const deleteImage = data.get("deleteImage") === "true";
    const categories = JSON.parse(data.get("categories") as string);

    const newContents = contents.map((content: any) => {
        if (content.type === "image" || content.type === "video" || content.type === "file") {
            if(content.value.url) return content
            return {
                ...content,
                value: {
                    ...content.value,
                    file: files.find((file) => file.name === content.value.file)
                }
            }
        } else {
            return content
        }
    })

    console.log({images, deleteImage, files, newContents})
    
    const role = await UpdateBlog(paramsID.id, titles, descriptions, newContents, images, slug, categories, deleteImage);

    return NextResponse.json(role);
}