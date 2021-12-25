import { Editor, Plugin } from "obsidian";
import { addIcons } from "../icons/customIcons";
import { PixrView } from "../view/pixrView";
import PixrSettingsTab from "../settings/settingsTab";
import { DEFAULT_SETTINGS } from "src/settings/settingsData";
import { PixrSettings } from "src/settings/settingsData";
import { dragNDropImage, Pixr_View_ } from "src/util/constants";
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
            Pixr_View_,
            (leaf: any) => new PixrView(leaf, this, this.app, this.settings)
        );

        this.addCommand({
            id: "open-pixr-view",
            name: "Open Pixr View",
            icon: "pixricon",
            callback: async () => {
                if (
                    this.app.workspace.getLeavesOfType(Pixr_View_).length == 0
                ) {
                    if (this.settings.pixrViewPosition == "left") {
                        await this.app.workspace
                            .getLeftLeaf(false)
                            .setViewState({
                                type: Pixr_View_,
                            });
                    } else {
                        await this.app.workspace
                            .getRightLeaf(false)
                            .setViewState({
                                type: Pixr_View_,
                            });
                    }
                }
                this.app.workspace.revealLeaf(
                    this.app.workspace.getLeavesOfType(Pixr_View_).first()
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
            .getLeavesOfType(Pixr_View_)
            .forEach((leaf: any) => leaf.detach());
        console.log("Pixr unloaded");
    }

    addPixrView() {
        if (this.app.workspace.getLeavesOfType(Pixr_View_).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: Pixr_View_,
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
