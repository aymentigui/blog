"use server"

import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendSubscribeEmail, sendUnsubscribeEmail } from "../email";

export async function subscribe(email: string) {

    const schema = z.object({
        email: z.string().email(),
    })

    try {
        const result = schema.safeParse({ email });
        if (!result.success) {
            return { status: 400, data: result.error.errors };
        }

        const emailExist = await prisma.subscriber.findUnique({ where: { email } });

        if (emailExist) {
            await prisma.subscriber.delete({ where: { email } });
            await sendUnsubscribeEmail({nom:email.split("@")[0],email});
        } else {
            await prisma.subscriber.create({ data: { email } });
            await sendSubscribeEmail({nom:email.split("@")[0],email});
        }

        return { status: 200, data: "success" };

    } catch (error) {
        return { status: 400, data: error };
    }

}