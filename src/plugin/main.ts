import * as CodeMirror from "codemirror";
import { Plugin, Workspace, WorkspaceLeaf, Editor } from "obsidian";
import { addIcons } from "../icons/customIcons";
import { MultiPixView } from "../view/mulitpixView";
import MultiPixSettingsTab from "../settings/settingsTab";
import { DEFAULT_SETTINGS } from "src/settings/settingsData";
import { MultiPixSettings } from "src/settings/settingsData";
import { MultiPix_View_ } from "src/util/constants";

export default class MultiPixPlugin extends Plugin {
    settings: MultiPixSettings;
    apiKey: string;
    embedType: string;

    get view() {
        let leaf = (
            this.app.workspace.getLeavesOfType(MultiPix_View_) ?? []
        ).shift();
        if (leaf && leaf.view && leaf.view instanceof MultiPixView)
            return leaf.view;
    }

    async onload() {
        addIcons();

        await this.loadSettings();
        console.log("MultiPix v" + this.manifest.version + " loaded");

        this.addSettingTab(new MultiPixSettingsTab(this.app, this));

        this.registerView(
            MultiPix_View_,
            (leaf: WorkspaceLeaf) =>
                new MultiPixView(leaf, this, this.app, this.settings)
        );

        this.addCommand({
            id: "open-multipix-view",
            name: "Open MultiPix View",
            icon: "multipixicon",
            callback: async () => {
                if (
                    this.app.workspace.getLeavesOfType(MultiPix_View_).length ==
                    0
                ) {
                    await this.app.workspace.getRightLeaf(false).setViewState({
                        type: MultiPix_View_,
                    });
                }
                this.app.workspace.revealLeaf(
                    this.app.workspace.getLeavesOfType(MultiPix_View_).first()
                );
            },
        });

        if (this.app.workspace.layoutReady) {
            this.addMultiPixView();
        } else {
            this.registerEvent(
                this.app.workspace.on(
                    "layout-ready",
                    this.addMultiPixView.bind(this)
                )
            );
        }

        this.app.workspace.onLayoutReady(() => {
            const codeMirror = (cm: any) => {
                cm.on("drop", this.calculatePageCount);
            };
            this.registerEvent(this.app.workspace.on("codemirror", codeMirror));
            this.registerCodeMirror((cm: CodeMirror.Editor) => {
                cm.on("drop", (instance, event) => {
                    const data = event.dataTransfer;
                    const html = data.getData("text/html");
                    const match = html.match(/src\s*=\s*"(.+?)"/);
                    if (match == undefined) {
                        console.log("MultiPix: Datatransfer unsuccessful 🤷🏽‍♀️");
                        return;
                    }
                    if (match.length) {
                        const coords = instance.coordsChar(
                            { left: event.clientX, top: event.clientY },
                            "window"
                        );
                        if (DEFAULT_SETTINGS.embedType === "HTML") {
                            instance.replaceRange(
                                `<img src="${match[1]}" width="100%">`,
                                coords,
                                coords
                            );
                        } else if (DEFAULT_SETTINGS.embedType === "Markdown") {
                            instance.replaceRange(
                                `![Image](${match[1]})`,
                                coords,
                                coords
                            );
                        }
                    }
                });
            });
        });
    }

    codeMirror = (cm: any) => {
        cm.on("drop", this.calculatePageCount);
    };
    calculatePageCount() {
        console.log("hello");
    }

    destroy(): void {
        var currentView = document.querySelector(".multipix-view-container");
        currentView.remove;
    }

    initLeaf(workspace: Workspace): void {
        if (workspace.getLeavesOfType("multipix").length == 0) {
            workspace.getRightLeaf(false).setViewState({
                type: "multipix",
            });
        }
    }
    onunload() {
        this.app.workspace
            .getLeavesOfType(MultiPix_View_)
            .forEach((leaf) => leaf.detach());
        console.log("MultiPix unloaded");
    }

    addMultiPixView() {
        if (this.app.workspace.getLeavesOfType(MultiPix_View_).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: MultiPix_View_,
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
