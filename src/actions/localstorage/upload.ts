"use server"
import path from 'path';
import * as fs from 'fs';
/**
 * uploadFile
 *
 * @param {string} filePathNameExtension Le nom du fichier avec son chemin sans extention
 * @param {File} file Le fichier a uploader
 * @returns {Promise<{status: number, data: {message?: string, succes?: boolean, path?: string}}>} Retourne un objet avec un status  et un message. Si le fichier est upload avec succes, le status est a 200 et le message contient le chemin du fichier.
 */

export const uploadFile = async (filePathNameExtension: string, file: File) => {
    if (!filePathNameExtension) {
        return { status: 400 };
    }

    const folderPath = path.dirname(path.join(process.cwd(), filePathNameExtension));

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    let filePath = path.join(process.cwd(), filePathNameExtension);
    let fileName = filePathNameExtension;
    let i = 1;
    while (fs.existsSync(filePath)) {
        const nameParts = fileName.split('.');
        const name = nameParts.slice(0, -1).join('.');
        const extension = nameParts[nameParts.length - 1];
        fileName = `${name} (${i++}).${extension}`;
        filePath = path.join(process.cwd(), fileName);
    }
    fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
    return { status: 200, data: { path: fileName} };
};
