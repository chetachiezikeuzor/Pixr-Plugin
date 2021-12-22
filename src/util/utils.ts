import { Notice, TAbstractFile, TFolder } from "obsidian";
import { clientID } from "./constants";

export function validFolderPathQ(path: string, plugin: any) {
    const file: TAbstractFile = plugin.app.vault.getAbstractFileByPath(path);
    return file && file instanceof TFolder;
}

export async function fetchDownload(downloadURL: string) {
    try {
        const result = await fetch(downloadURL, {
            headers: {
                Authorization: `Client-ID ${clientID}`,
            },
        });
        console.log(result);
    } catch (err) {
        console.log(err);
        new Notice(`Something bad happened: ${err}`);
    }
}
