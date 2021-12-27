import { Embed } from "src/util/types";

export interface PixrSettings {
    customApiKey: string;
    folderPath: string;
    embedType: Embed;
    downloadType: string;
    pixrViewPosition: string;
    namingConvention: string;
    showDownloadConfirmationModal: boolean;
}

export const DEFAULT_SETTINGS: PixrSettings = {
    customApiKey: "",
    folderPath: "/",
    embedType: "markdown",
    downloadType: "medium",
    pixrViewPosition: "left",
    namingConvention: "YYYY-MM-DD HHmmss",
    showDownloadConfirmationModal: true,
};
