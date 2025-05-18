import { sendNewBlogEmail } from "@/actions/email";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

    const { title, description, categorie, slug } = await request.json();
    const categoriesJson = JSON.parse(categorie);

    await sendNewBlogEmail({ title, description, categorie:categoriesJson, slug });

    return NextResponse.json({ message: "Emails envoyés avec succès" });
}