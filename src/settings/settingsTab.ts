import { App, PluginSettingTab, Setting } from "obsidian";
import { EMBED_TYPES } from "../util/constants";
import { Embed } from "src/util/types";

import MultiPixPlugin from "../plugin/main";

export default class MultiPixSettingsTab extends PluginSettingTab {
    plugin: MultiPixPlugin;

    constructor(app: App, plugin: MultiPixPlugin) {
        super(app, plugin);
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h2", { text: "MultiPix Settings" });

        new Setting(containerEl)
            .setName("APIKey")
            .setDesc("Use this link to get your custom APIKey")
            .addText((text) =>
                text
                    .setPlaceholder("APIKey")
                    .setValue("")
                    .onChange(async (value) => {
                        this.plugin.settings.apiKey = value;
                        await this.plugin.saveSettings();
                    })
            );
        new Setting(containerEl)
            .setName("Folder Path")
            .setDesc(
                'This is the path by which to save your images. The default is the root of your vault \'/\'. If you do wish it, leave out the first slash in front. e.g. To save the image in "Images," type in "Images" (no quotes). To save an image to "VAULT NAME/Attachments/Images," type in "Attachments/Images."'
            )
            .addText((text) =>
                text
                    .setPlaceholder("/")
                    .setValue(this.plugin.settings.folderPath)
                    .onChange(async (value) => {
                        this.plugin.settings.folderPath = value;
                        await this.plugin.saveSettings();
                    })
            );
        new Setting(containerEl)
            .setName("Choose Drag 'n Drop Embed Type")
            .setDesc("This is your default embed type for drag 'n drop images.")
            .addDropdown((dropdown) => {
                let types: Record<string, string> = {};
                EMBED_TYPES.map((type) => (types[type] = type));
                dropdown.addOptions(types);
                dropdown
                    .setValue(this.plugin.settings.embedType)
                    .onChange(async (value) => {
                        this.plugin.settings.embedType = value as Embed;
                        this.plugin.settings.embedType;
                        await this.plugin.saveSettings();
                    });
            });
        const div = containerEl.createEl("div", {
            cls: "cDonationSection",
        });

        const credit = createEl("p");
        const donateText = createEl("p");
        donateText.appendText(
            "If you like this Plugin and are considering donating to support continued development, use the button below!"
        );
        credit.appendText("Created with ❤️ by Chetachi");
        credit.setAttribute("style", "color: var(--text-muted)");
        div.appendChild(donateText);
        div.appendChild(credit);

        div.appendChild(
            createDonateButton("https://www.buymeacoffee.com/chetachi")
        );
    }
    save() {
        this.plugin.saveSettings();
    }
}

const createDonateButton = (link: string): HTMLElement => {
    const a = createEl("a");
    a.setAttribute("href", link);
    a.addClass("buymeacoffee-chetachi-img");
    a.innerHTML = `<img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=chetachi&button_colour=e3e7ef&font_colour=262626&font_family=Inter&outline_colour=262626&coffee_colour=ff0000" height="36px">`;
    return a;
};
