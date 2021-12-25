import * as React from "react";
import PixrPlugin from "../plugin/main";
import * as ReactDOM from "react-dom";
import PixrApp from "./pixrApp";
import { PluginContext } from "./context";
//@ts-ignore
import { App, ItemView, WorkspaceLeaf } from "obsidian";
import { PixrSettings } from "../settings/settingsData";
import { Pixr_View_ } from "src/util/constants";

export class PixrView extends ItemView {
    app: App;
    apiKey = "";
    plugin: PixrPlugin;
    settings: PixrSettings;
    private reactComponent: React.ReactElement;
    containerEl: HTMLElement;

    constructor(
        leaf: WorkspaceLeaf,
        plugin: PixrPlugin,
        app: App,
        settings: PixrSettings
    ) {
        super(leaf);
        this.plugin = plugin;
        this.app = app;
        this.settings = settings;
        this.containerEl = this.containerEl;
    }

    getViewType(): string {
        return Pixr_View_;
    }

    getDisplayText(): string {
        return "Pixr";
    }

    getIcon(): string {
        return "pixricon";
    }

    load(): void {
        //@ts-ignore
        super.load();
        this.draw();
    }

    draw(): void {
        ReactDOM.render(
            <PluginContext.Provider value={this.plugin}>
                <PixrApp />
            </PluginContext.Provider>,
            this.containerEl.children[1]
        );
    }
}
