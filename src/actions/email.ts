"use server"
import nodemailer from 'nodemailer'
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const transporter = nodemailer.createTransport({
    // Configurez ici votre service d'envoi d'emails
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export async function sendEmail(to: string, subject: string, html: string) {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email configuration is missing')
        return
    }
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    })
}

const sendEmail2 = async (
    to: string,
    subject: string,
    html: string,
): Promise<{ status: number; message: string }> => {
    try {

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });

        return { status: 200, message: 'Email envoyé avec succès' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return { status: 500, message: `Erreur lors de l'envoi de l'email: ${(error as Error).message}` };
    }
};

export async function sendEmails(emailList: string[], subject: string, html: string) {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email configuration is missing')
        return
    }
    const chunkSize = 500;
    for (let i = 0; i < emailList.length; i += chunkSize) {
        const chunk = emailList.slice(i, i + chunkSize);
        await transporter.sendMail({
            from: `Aimen Blog`,
            to: process.env.EMAIL_USER,
            bcc: chunk,
            subject,
            html: html,
        });
    }
}
// Fonction pour lire un template HTML
const getEmailTemplate = async (templateName: string): Promise<string> => {
    try {
        const templatePath = path.join(process.cwd(), 'templates', `${templateName}.html`);
        return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
        console.error(`Erreur lors de la lecture du template ${templateName}:`, error);
        throw new Error(`Impossible de charger le template d'email: ${templateName}`);
    }
};

// Fonction pour remplacer les variables dans un template
const replaceTemplateVariables = (template: string, variables: Record<string, string>): string => {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
    }
    return result;
};


type SubscribeEmailData = {
    nom: string;
    email: string;
};

type UnsubscribeEmailData = {
    nom: string;
    email: string;
};

type NewBlogEmailData = {
    title: string;
    categorie: string;
    description: string;
    slug: string;
};

// Fonction pour envoyer un email


// Fonction pour envoyer un email de bienvenue (inscription)
export async function sendSubscribeEmail(data: SubscribeEmailData): Promise<{ status: number; message: string }> {
    try {
        const template = await getEmailTemplate('email-subscribe');
        const html = replaceTemplateVariables(template, {
            nom: data.nom,
            email: data.email,
            url: process.env.DOMAIN_URL ?? "http://localhost:3000"
        });

        return await sendEmail2(
            data.email,
            'Welcome to our Newsletter!',
            html
        );
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
        return { status: 500, message: `Erreur: ${(error as Error).message}` };
    }
}

// Fonction pour envoyer un email de désabonnement
export async function sendUnsubscribeEmail(data: UnsubscribeEmailData): Promise<{ status: number; message: string }> {
    try {
        const template = await getEmailTemplate('email-unsubscribe');
        const html = replaceTemplateVariables(template, {
            nom: data.nom,
            email: data.email,
            url: process.env.DOMAIN_URL ?? "http://localhost:3000"
        });

        return await sendEmail2(
            data.email,
            'Unsubscription Confirmation',
            html
        );
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de désabonnement:', error);
        return { status: 500, message: `Erreur: ${(error as Error).message}` };
    }
}

// Fonction pour envoyer un email de nouvel article
export async function sendNewBlogEmail(data: NewBlogEmailData): Promise<{ status: number; message: string }> {
    try {
        const template = await getEmailTemplate('email-new-blog');
        const html = replaceTemplateVariables(template, {
            title: data.title,
            categorie: data.categorie,
            description: data.description,
            slug: data.slug,
            url: process.env.DOMAIN_URL ?? "http://localhost:3000"
        });

        const emails = await prisma.subscriber.findMany()
        await sendEmails(
            emails.map((email) => email.email),
            `Nouvel article: ${data.title}`,
            html
        );

        return { status: 200, message: 'Email envoyé avec succès' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de nouvel article:', error);
        return { status: 500, message: `Erreur: ${(error as Error).message}` };
    }
}

export async function sendMessage(data: any, token: string): Promise<{ status: number; message: string }> {
    try {

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        if (!secretKey) {
            return { status: 500, message: "ReCaptcha secret key not found" };
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        const response = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const resultRecaptcha = await response.json();

        if (!resultRecaptcha.success) {
            return { status: 400, message: "Invalid reCAPTCHA token" };
        }

        const template = await getEmailTemplate('email-new-message');

        const schema = z.object({
            email: z.string().email(),
            name: z.string(),
            message: z.string(),
        });

        const result = schema.safeParse(data);

        if (!result.success) {
            return { status: 400, message: "Invalid data" };
        }

        const html = replaceTemplateVariables(template, {
            name: data.name,
            email: data.email,
            message: data.message,
        });

        await sendEmail(
            "aymentigui@gmail.com",
            `Nouvel message: ${data.title}`,
            html
        );

        return { status: 200, message: 'Email envoyé avec succès' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de nouvel article:', error);
        return { status: 500, message: `Erreur: ${(error as Error).message}` };
    }
}

export async function sendCode(data: any): Promise<{ status: number; message: string }> {
    try {
        const template = await getEmailTemplate('email-new-code');

        const html = replaceTemplateVariables(template, {
            name: data.code,
        });

        await sendEmail(
            data.email,
            `Confirmation code`,
            html
        );

        return { status: 200, message: 'Email envoyé avec succès' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de nouvel article:', error);
        return { status: 500, message: `Erreur: ${(error as Error).message}` };
    }
}

export async function send2FACode(data: any): Promise<{ status: number; message: string }> {
    try {
        const template = await getEmailTemplate('email-new-code-2af');

        const html = replaceTemplateVariables(template, {
            name: data.code,
        });

        await sendEmail(
            data.email,
            `Confirmation 2FA code`,
            html
        );

        return { status: 200, message: 'Email envoyé avec succès' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de nouvel article:', error);
        return { status: 500, message: `Erreur: ${(error as Error).message}` };
    }
}

// Fonction pour envoyer un email de test
export async function sendTestEmail(email: string): Promise<{ status: number; message: string }> {
    try {
        return await sendEmail2(
            email,
            'Test de configuration SMTP',
            '<h1>Test de configuration SMTP</h1><p>Si vous recevez cet email, votre configuration SMTP fonctionne correctement!</p>'
        );
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de test:', error);
        return { status: 500, message: `Erreur: ${(error as Error).message}` };
    }
}
