import { AddBlog } from "@/actions/blog/set";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const data= await request.formData();
    let images = data.get("file") as unknown as File[];
    const slug = data.get("slug") as string;
    const titles = JSON.parse(data.get("titles") as string);
    const descriptions = JSON.parse(data.get("descriptions") as string);
    const contents = JSON.parse(data.get("contents") as string);
    const files = data.getAll("files") as unknown as File[];
    const categories = JSON.parse(data.get("categories") as string);

    const newContents = contents.map((content: any) => {
        if (content.type === "image" || content.type === "video" || content.type === "file") {
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

    const res = await AddBlog(titles, descriptions, newContents, images, slug, categories);
    return NextResponse.json(res);
}