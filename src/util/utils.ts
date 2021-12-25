//@ts-ignore
import { TAbstractFile, TFolder, Notice } from "obsidian";
import PixrPlugin from "src/plugin/main";
import { copyText } from "./constants";
import superagent from "superagent";
import moment from "moment";
import { SI_SYMBOLS, BYTE_SIZES } from "./constants";

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

export const simpleGet = (options: any) => {
    superagent
        .get(options.url)
        .set("stats", "true")
        .then(function (res: any) {
            if (options.onSuccess) options.onSuccess(res);
        })
        .catch(function (err: any) {
            if (options.onAbort) options.onAbort(err);
        });
};

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
    let blob = await fetch(`${imageURL}`).then((r) => r.blob());
    return blob;
}

export function downloadImage(
    e: any,
    imageURL: string,
    imageDesc: string,
    ref: any,
    plugin: PixrPlugin
) {
    (async function () {
        let blob = await fetch(`${imageURL}`).then((r) => r.blob());
        let fileExtension = blob.type.split("/").pop();

        await saveThisAsImage(blob, imageDesc, fileExtension, plugin);
    })();
}

export async function saveThisAsImage(
    blob: Blob,
    imageDesc: string,
    fileExtension: string,
    plugin: PixrPlugin
) {
    //@ts-ignore
    const vault = plugin.app.vault.adapter.basePath;
    const fileTitle = imageDesc ? capitalizeFirstLetter(imageDesc) : "Image";
    const arrBuff = await blob.arrayBuffer();
    const now = window.moment().format("YYYY-MM-DD HHmmss");
    const folderPath =
        plugin.settings.folderPath === "" ? "/" : plugin.settings.folderPath;
    const filePath = `${folderPath}/${fileTitle} ${now}.${fileExtension}`;

    if (validFolderPathQ(folderPath, plugin)) {
        plugin.app.vault.createBinary(filePath, arrBuff);
        new Notice("The image was saved  🥳");
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
            new Notice("The image link is in your clipboard");
        } catch (err) {
            new Notice("There was a problem!" + err);
        }
    } else {
        new Notice("The chosen folder path does not exist in your vault");
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

export function getImageDimension(source: any) {
    const img = new Image();
    let dimensions;
    img.src = source;
    img.onload = function () {
        dimensions = { width: img.naturalWidth, height: img.naturalHeight };
    };
    return dimensions;
}

export function getImageDimensions(source: any) {
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
