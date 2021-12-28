import { Editor, Plugin } from "obsidian";
import { addIcons } from "../icons/customIcons";
import { PixrView } from "../view/pixrView";
import PixrSettingsTab from "../settings/settingsTab";
import { PixrSettings, DEFAULT_SETTINGS } from "src/settings/settingsData";
import { PIXR_VIEW_ } from "src/util/constants";
import { dragNDropImage, triggerDownload } from "../util/utils";
import { EditorView } from "@codemirror/view";

export default class PixrPlugin extends Plugin {
    settings: PixrSettings;
    editorView: EditorView;
    embedType: string;
    editor: Editor;

    async onload() {
        addIcons();
        await this.loadSettings();
        console.log("Pixr v" + this.manifest.version + " loaded");
        this.addSettingTab(new PixrSettingsTab(this.app, this));
        this.registerView(
            PIXR_VIEW_,
            (leaf: any) => new PixrView(leaf, this, this.app, this.settings)
        );

        this.addCommand({
            id: "open-pixr-view",
            name: "Open Pixr View",
            icon: "pixr-icon",
            callback: async () => {
                if (
                    this.app.workspace.getLeavesOfType(PIXR_VIEW_).length == 0
                ) {
                    if (this.settings.pixrViewPosition == "left") {
                        await this.app.workspace
                            .getLeftLeaf(false)
                            .setViewState({
                                type: PIXR_VIEW_,
                            });
                    } else {
                        await this.app.workspace
                            .getRightLeaf(false)
                            .setViewState({
                                type: PIXR_VIEW_,
                            });
                    }
                }
                this.app.workspace.revealLeaf(
                    this.app.workspace.getLeavesOfType(PIXR_VIEW_).first()
                );
            },
        });

        if (this.app.workspace.layoutReady) {
            this.addPixrView();
        } else {
            this.registerEvent(
                this.app.workspace.on(
                    //@ts-ignore
                    "layout-ready",
                    this.addPixrView.bind(this)
                )
            );
        }

        this.app.workspace.onLayoutReady(() => {
            this.registerEditorExtension(
                EditorView.domEventHandlers({
                    drop: (e: DragEvent, editorView: EditorView) => {
                        const data = e.dataTransfer;
                        const html = data.getData("text/html");
                        const altText = html.match(/alt\s*=\s*"(.+?)"/);
                        const srcText = html.match(/src\s*=\s*"(.+?)"/);
                        const idText = html.match(/id\s*=\s*"(.+?)"/);
                        const mainSelection = editorView.state.selection?.main;

                        if (
                            srcText.length &&
                            srcText[1].contains("https://images.unsplash.com")
                        ) {
                            editorView.dispatch({
                                changes: [
                                    {
                                        from: mainSelection.from,
                                        to: mainSelection.to,
                                        insert: dragNDropImage(
                                            this.settings,
                                            srcText,
                                            altText
                                        ),
                                    },
                                ],
                            });
                            triggerDownload(idText[1]);
                            return true;
                        }

                        return false;
                    },
                })
            );
        });
    }

    onunload() {
        this.app.workspace
            .getLeavesOfType(PIXR_VIEW_)
            .forEach((leaf: any) => leaf.detach());
        console.log("Pixr unloaded");
    }

    addPixrView() {
        if (this.app.workspace.getLeavesOfType(PIXR_VIEW_).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: PIXR_VIEW_,
        });
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
