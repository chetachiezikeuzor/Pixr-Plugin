import * as React from "react";
import MultiPixPlugin from "../plugin/main";
import * as ReactDOM from "react-dom";
import MultiPixApp from "./multipixApp";
import { PluginContext } from "./context";
import { App, ItemView, WorkspaceLeaf } from "obsidian";
import { MultiPixSettings } from "../settings/settingsData";
import { MultiPix_View_ } from "src/util/constants";

export class MultiPixView extends ItemView {
    app: App;
    apiKey = "";
    plugin: MultiPixPlugin;
    settings: MultiPixSettings;
    private reactComponent: React.ReactElement;

    constructor(
        leaf: WorkspaceLeaf,
        plugin: MultiPixPlugin,
        app: App,
        settings: MultiPixSettings
    ) {
        super(leaf);
        this.plugin = plugin;
        this.app = app;
        this.settings = settings;
        this.containerEl = this.containerEl;
    }

    getViewType(): string {
        return MultiPix_View_;
    }

    getDisplayText(): string {
        return "MultiPix";
    }

    getIcon(): string {
        return "multipixicon";
    }

    load(): void {
        super.load();
        this.draw();
    }

    draw(): void {
        ReactDOM.render(
            <PluginContext.Provider value={this.plugin}>
                <MultiPixApp />
            </PluginContext.Provider>,
            this.containerEl.children[1]
        );
    }
}
