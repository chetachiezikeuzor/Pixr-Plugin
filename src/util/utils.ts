import {
    TAbstractFile,
    TFolder,
    Notice,
    App,
    normalizePath,
    TFile,
    Vault,
} from "obsidian";
import moment from "moment";
import { GetError } from "./error";
import PixrPlugin from "src/plugin/main";
import { SI_SYMBOLS, BYTE_SIZES, UNSPLASH } from "./constants";
import { PixrSettings } from "src/settings/settingsData";

export function setAttributes(element: any, attributes: any) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

export function wrapAround(value: number, size: number): number {
    return ((value % size) + size) % size;
}

export function abbreviateNumber(number: number) {
    let tier = (Math.log10(Math.abs(number)) / 3) | 0;
    if (tier == 0) return number;
    let suffix = SI_SYMBOLS[tier];
    let scale = Math.pow(10, tier * 3);
    let scaled = number / scale;
    return scaled.toFixed(0) + suffix;
}

export function bytesToSize(bytes: number) {
    if (bytes === 0) return "n/a";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i === 0) return `${bytes} ${BYTE_SIZES[i]})`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${BYTE_SIZES[i]}`;
}

export function validFolderPathQ(path: string, plugin: any) {
    const file: TAbstractFile = plugin.app.vault.getAbstractFileByPath(path);
    return file && file instanceof TFolder;
}

export function capitalizeFirstLetter(word: any) {
    return word.replace(/\w\S*/g, function (txt: any) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export async function getImageBlob(imageURL: string) {
    let blob = await fetch(imageURL).then((r) => r.blob());
    return blob;
}

export function getImageDimensions(source: string) {
    return new Promise(function (resolved, rejected) {
        const img = new Image();
        img.onload = function () {
            resolved({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        };
        img.src = source;
    });
}

export function downloadImage(
    e: any,
    imageURL: string,
    imageDesc: string,
    plugin: PixrPlugin,
    photoId: string
) {
    (async function () {
        await fetch(imageURL).then(async (r) => {
            if (r.status == 200) {
                let blob = await r.blob();
                let fileExtension = blob.type.split("/").pop();

                await saveThisAsImage(
                    blob,
                    imageURL,
                    imageDesc,
                    fileExtension,
                    plugin
                );
            } else {
                new Notice("Something went wrong!");
            }
        });
    })();
    triggerDownload(photoId);
}

export async function saveThisAsImage(
    blob: Blob,
    imageUrl: string,
    imageDesc: string,
    fileExtension: string,
    plugin: PixrPlugin
) {
    //@ts-ignore
    const vault = plugin.app.vault.adapter.basePath;
    const fileTitle = imageDesc
        ? capitalizeFirstLetter(imageDesc)
        : "Unsplash Image";
    const arrBuff = await blob.arrayBuffer();
    const now = moment().format(plugin.settings.namingConvention);
    const folderPath =
        plugin.settings.folderPath === "" ? "/" : plugin.settings.folderPath;
    const filePath = `${folderPath}/${fileTitle} ${now}.${fileExtension}`;

    if (validFolderPathQ(folderPath, plugin)) {
        plugin.app.vault.createBinary(filePath, arrBuff);
        const notice = new Notice("", 5000);
        //@ts-ignore
        setAttributes(notice.noticeEl, { style: "padding: 12px;" });
        //@ts-ignore
        notice.noticeEl.innerHTML = `<div style="font-weight: 700; text-align: center; margin-bottom: 12px;"> <strong>Downloaded: </strong>"${capitalizeFirstLetter(
            imageDesc
        )}"</div><div style="height: 14vh; flex-grow: 1; overflow: hidden; border-radius: 4px; margin-bottom: 0  width: 8rem;"><img style="height: 100%; min-width: 100%; overflow: hidden; cursor: pointer; object-fit: cover;" src="${imageUrl}"/> </div> <div style="text-align: center; margin-top: -12px;"> Embed now in clipboard! </div>`;
        try {
            await navigator.clipboard.writeText(
                copyText(
                    plugin.settings,
                    fileTitle,
                    now,
                    vault,
                    fileExtension,
                    filePath
                )
            );
        } catch (err) {
            new Notice("There was a problem: " + err);
        }
    } else {
        new Notice("Couldn't find folder!");
    }
}

export async function wait(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function unformatDate(someDate: any) {
    let date;
    (date as any) = moment(someDate).format("MM.DD");
    someDate.toString();
    return date;
}

export function resolveTFolder(app: App, folderString: string): TFolder {
    folderString = normalizePath(folderString);

    const folder = app.vault.getAbstractFileByPath(folderString);
    if (!folder) {
        throw new GetError(`Folder "${folderString}" doesn't exist`);
    }
    if (!(folder instanceof TFolder)) {
        throw new GetError(`${folderString} is a file, not a folder`);
    }

    return folder;
}

export function getTFilesFromFolder(
    app: App,
    folderString: string
): Array<TFile> {
    const folder = resolveTFolder(app, folderString);

    const files: Array<TFile> = [];
    Vault.recurseChildren(folder, (file: TAbstractFile) => {
        if (file instanceof TFile) {
            files.push(file);
        }
    });

    files.sort((a, b) => {
        return a.basename.localeCompare(b.basename);
    });

    return files;
}

export function dragNDropImage(
    settings: PixrSettings,
    srcText: any,
    altText: any
) {
    const imageAlt = altText[1].replaceAll("&quot;", "");
    if (settings.embedType === "html")
        return `<img src="${srcText[1]}" alt="${capitalizeFirstLetter(
            imageAlt
        )}"/>`;
    else if (settings.embedType === "markdown")
        return `![${capitalizeFirstLetter(imageAlt)}](${srcText[1]})`;
}

export function copyText(
    settings: PixrSettings,
    imageDesc: string,
    now: any,
    vault: string,
    fileExtension: string,
    filePath: string
) {
    if (settings.embedType === "html")
        return `<img src="app:///local${vault}/${filePath}" alt="${capitalizeFirstLetter(
            imageDesc
        )}"/>`;
    else if (settings.embedType === "markdown")
        return `![[${
            imageDesc ? imageDesc : "Unsplash Image"
        } ${now}.${fileExtension}]]`;
}

export function currentLocale(): string {
    if (typeof window === "undefined") return "en-US";
    return window.navigator.language;
}

export function triggerDownload(photoId: string) {
    UNSPLASH.photos.get({ photoId: photoId }).then((result) => {
        if (result.type === "success") {
            const photo = result.response;
            UNSPLASH.photos.trackDownload({
                downloadLocation: photo.links.download_location,
            });
        }
    });
}
