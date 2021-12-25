import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { config } from "private";
import { createApi } from "unsplash-js";
import { SelectOption } from "./types";
export const Pixr_View_ = "pixr-view-container";
import { capitalizeFirstLetter } from "./utils";
export const PIXR_VIEW_SIDE = ["right", "left"];
import { PixrSettings } from "src/settings/settingsData";
export const EMBED_TYPES = ["markdown", "html"] as const;
export const BYTE_SIZES = ["Bytes", "KB", "MB", "GB", "TB"];
export const SI_SYMBOLS = ["", "k", "M", "G", "T", "P", "E"];

export const unsplash = createApi({
    accessKey: config.UNSPLASH_ACCESSKEY,
});

export const DROPDOWN_OPTIONS: SelectOption[] = [
    {
        label: "xsmall",
        value: "thumb",
    },
    {
        label: "small",
        value: "small",
    },
    {
        label: "medium",
        value: "regular",
    },
    {
        label: "large",
        value: "full",
    },
];

export const LOAD_STATE = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    LOADING: "LOADING",
    SUBMITTED: "SUBMITTED",
};

export const dragNDropImage = (
    settings: PixrSettings,
    srcText: any,
    altText: any
) => {
    const imageAlt = altText[1].replaceAll("&quot;", "");
    if (settings.embedType === "html")
        return `<img src="${
            srcText[1]
        }" width="100%" alt="${capitalizeFirstLetter(imageAlt)}"/>`;
    else if (settings.embedType === "markdown")
        return `![${capitalizeFirstLetter(imageAlt)}](${srcText[1]})`;
};

export const copyText = (
    settings: PixrSettings,
    imageDesc: string,
    now: any,
    vault: string,
    fileExtension: string,
    filePath: string
) => {
    if (settings.embedType === "html")
        return `<img src="app:///local${vault}/${filePath}" width="100%"/>`;
    else if (settings.embedType === "markdown")
        return `![[${
            imageDesc ? imageDesc : "image"
        } ${now}.${fileExtension}]]`;
};
