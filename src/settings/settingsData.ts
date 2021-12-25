import { Embed } from "src/util/types";

export interface PixrSettings {
    mySetting: string;
    apiKey: string;
    folderPath: string;
    embedType: Embed;
    downloadType: string;
    pixrViewPosition: string;
}

export const DEFAULT_SETTINGS: PixrSettings = {
    mySetting: "default",
    apiKey: "",
    folderPath: "/",
    embedType: "markdown",
    downloadType: "medium",
    pixrViewPosition: "left",
};
