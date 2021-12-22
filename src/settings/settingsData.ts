import { Embed } from "src/util/types";

export interface MultiPixSettings {
    mySetting: string;
    apiKey: string;
    folderPath: string;
    embedType: Embed;
}

export const DEFAULT_SETTINGS: MultiPixSettings = {
    mySetting: "default",
    apiKey: "",
    folderPath: "/",
    embedType: "Markdown",
};
