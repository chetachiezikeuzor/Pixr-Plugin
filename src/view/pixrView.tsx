import * as React from "react";
import PixrPlugin from "../plugin/main";
import * as ReactDOM from "react-dom";
import PixrApp from "./pixrApp";
import { PluginContext } from "../util/context";
import { App, ItemView, WorkspaceLeaf } from "obsidian";
import { PixrSettings } from "../settings/settingsData";
import { PIXR_VIEW_ } from "src/util/constants";

export class PixrView extends ItemView {
    app: App;
    plugin: PixrPlugin;
    settings: PixrSettings;
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
        return PIXR_VIEW_;
    }

    getDisplayText(): string {
        return "Pixr";
    }

    getIcon(): string {
        return "pixr-icon";
    }

    load(): void {
        super.load();
        this.draw();
    }

    draw(): void {
        ReactDOM.render(
            <PluginContext.Provider value={this.plugin}>
                <PixrApp plugin={this.plugin} />
            </PluginContext.Provider>,
            this.containerEl.children[1]
        );
    }
}
