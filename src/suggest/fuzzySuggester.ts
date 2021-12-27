import { App, FuzzySuggestModal, TFile } from "obsidian";
import { getTFilesFromFolder } from "../util/utils";
import PixrPlugin from "../plugin/main";
import { errorWrapperSync } from "../util/error";
import { logError } from "../util/log";

export class FuzzySuggester extends FuzzySuggestModal<TFile> {
    public app: App;
    private plugin: PixrPlugin;

    constructor(app: App, plugin: PixrPlugin) {
        super(app);
        this.app = app;
        this.plugin = plugin;
    }

    getItems(): TFile[] {
        if (!this.plugin.settings.folderPath) {
            return this.app.vault.getMarkdownFiles();
        }
        const files = errorWrapperSync(
            () =>
                getTFilesFromFolder(this.app, this.plugin.settings.folderPath),
            `Couldn't find: "${this.plugin.settings.folderPath}"`
        );
        if (!files) {
            return [];
        }
        return files;
    }

    getItemText(item: TFile): string {
        return item.basename;
    }

    onChooseItem(item: TFile): void {
        console.log(item);
    }

    start(): void {
        try {
            this.open();
        } catch (e) {
            logError(e);
        }
    }
}
