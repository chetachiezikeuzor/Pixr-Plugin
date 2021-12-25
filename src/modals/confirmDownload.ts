import {
    App,
    Modal,
    //@ts-ignore
    Setting,
    ButtonComponent,
    //@ts-ignore
} from "obsidian";
import { setAttributes } from "src/util/setAttributes";
import { downloadImage } from "src/util/utils";
import PixrPlugin from "../plugin/main";

// WIP

export default class ConfirmDownloadModal extends Modal {
    download: string;
    plugin: PixrPlugin;
    mySnippetsEl: HTMLDivElement;
    e: any;
    imageURL: string;
    imageDesc: string;
    ref: any;

    constructor(
        app: App,
        plugin: PixrPlugin,
        e: any,
        imageURL: string,
        imageDesc: string,
        ref: any
    ) {
        super(app);
        this.e = e;
        this.ref = ref;
        this.plugin = plugin;
        this.imageURL = imageURL;
        this.imageDesc = imageDesc;
        this.onOpen = () => this.display(true);
    }

    private async display(focus?: boolean) {
        const { contentEl } = this;

        contentEl.empty();
        contentEl.setAttribute(
            "style",
            "margin-top: 0px, align-self: center; text-align: center;"
        );

        const imgWrap = document.createElement("div");
        const img = document.createElement("img");
        img.src = this.imageURL;
        img.alt = this.imageDesc;
        imgWrap.appendChild(img);
        contentEl.appendChild(imgWrap);
        setAttributes(imgWrap, {
            style: "display: contents; width: 100%;  flex-direction: column; ",
        });
        setAttributes(img, {
            style: "z-index: 0; height: 55vh; width: auto; margin: 0 auto; vertical-align: bottom; text-align: center; display: block;opacity: 1; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px 0 var(--background-modifier-border);",
        });
        const title = document.createElement("p");
        title.setText("Do you want to download?");
        setAttributes(title, {
            style: "display: block;text-align: center; margin-block-start: 0.46em; margin-block-end: 0.46em; margin-inline-start: 0px;margin-inline-end: 0px;font-weight: bold;color: var(--text-faint);line-height: 1.1667;font-weight: 700;",
        });

        const abort = async () => {
            this.close();
        };
        const confirm = async () => {
            downloadImage(
                this.e,
                this.imageURL,
                this.imageDesc,
                this.ref,
                this.plugin
            );
        };
        const confirmationButton = new ButtonComponent(contentEl)
            .setButtonText("Download")
            .onClick(confirm);
        confirmationButton.buttonEl.addClass("wg-button");

        confirmationButton.onClick((e) => {
            confirm();
            this.close();
        });

        const abortButton = new ButtonComponent(contentEl)
            .setButtonText("No thanks!")
            .onClick(confirm);

        abortButton.buttonEl.addClass("wg-button");
        abortButton.onClick((e) => {
            abort();
        });
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
    }
}
