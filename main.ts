import { url } from "inspector";
import {
    App,
    Constructor,
    Modal,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting,
    Workspace,
    ItemView,
    WorkspaceLeaf,
    TFile,
    TFolder,
    TAbstractFile,
    Vault,
    TextAreaComponent,
    DataAdapter,
    Events,
    FileSystemAdapter,
    normalizePath,
} from "obsidian";
import { __awaiter } from "tslib";
import * as path from "path";
import { pathToFileURL } from "url";

var obsidian = require("obsidian");

const Obsplash_View_ = "obsplash-view-container";

const EMBED_TYPES = ["Markdown", "HTML"] as const;

type Embed = typeof EMBED_TYPES[number];

interface ObsplashSettings {
    mySetting: string;
    apiKey: string;
    imgName: string;
    folderPath: string;
    embedType: Embed;
}

const DEFAULT_SETTINGS: ObsplashSettings = {
    mySetting: "default",
    apiKey: "",
    imgName: "obs",
    folderPath: "/",
    embedType: "Markdown",
};

class ObsplashView extends ItemView {
    app: App;
    apiKey = "";
    plugin: Obsplash;
    settings: ObsplashSettings;

    constructor(
        leaf: WorkspaceLeaf,
        plugin: Obsplash,
        app: App,
        settings: ObsplashSettings,
        apiKey: string
    ) {
        super(leaf);
        this.plugin = plugin;
        this.app = app;
        this.settings = settings;
        this.apiKey = apiKey;
    }

    getViewType(): string {
        return Obsplash_View_;
    }

    getDisplayText(): string {
        return "Obsplash";
    }

    getIcon(): string {
        return "unsplashicon";
    }

    load(): void {
        super.load();
        this.draw();
    }

    draw(): void {
        const containerMain = this.containerEl.children[1];
        let vault = this.app.vault;
        function validFolderPathQ(path: string) {
            const file: TAbstractFile = vault.getAbstractFileByPath(path);
            return file && file instanceof TFolder;
        }

        if (!(this.app.vault.adapter instanceof FileSystemAdapter)) {
            throw new Error("app.vault is not a FileSystemAdapter instance");
        }
        let vaultPath = this.app.vault.adapter.getBasePath();
        let settings = this.settings;

        const container = document.createElement("div");
        const form = document.createElement("form");
        const resultStats = document.createElement("div");
        const backToTopBar = document.createElement("div");

        container.setAttribute("class", "obsplash-view-container");
        backToTopBar.setAttribute("class", "backToTopBar");
        backToTopBar.setAttribute("id", "top");

        container.appendChild(form);
        container.appendChild(resultStats);

        form.innerHTML = `<input
type="text"
class="search-input js-search-input"
type="search"
class="input"
value=""
placeholder="Try searching for an image!"
/>
<button type="submit" class="btn mod-cta">Search</button>`;

        const resultContainer = document.createElement("div");
        const paginationDiv = document.createElement("div");
        const buttonNext = document.createElement("a");
        const buttonPrevious = document.createElement("a");

        const spinner = document.createElement("div");
        const bounce1 = document.createElement("div");
        const bounce2 = document.createElement("div");

        resultContainer.setAttribute("class", "result-container");
        paginationDiv.setAttribute("class", "pagination");
        buttonNext.setAttribute("class", "hidden next-btn js-next mod-cta");
        buttonPrevious.setAttribute("class", "hidden prev-btn js-prev mod-cta");
        buttonNext.setAttribute("href", "#top");
        buttonPrevious.setAttribute("href", "#top");
        spinner.setAttribute("class", "spinner js-spinner hidden");
        bounce1.setAttribute("class", "double-bounce1");
        bounce2.setAttribute("class", "double-bounce2");

        buttonNext.innerHTML = `<button href="#top" style="text-decoration: none;" class="mod-cta">Next</button>`;
        buttonPrevious.innerHTML = `<button href="#top" style="text-decoration: none;" class="mod-cta">Previous</button>`;

        paginationDiv.appendChild(buttonPrevious);
        paginationDiv.appendChild(buttonNext);
        spinner.appendChild(bounce1);
        spinner.appendChild(bounce2);

        // store references to the form and elements globally

        form.setAttribute("class", "js-form");
        form.addEventListener("submit", handleSubmit);

        resultStats.setAttribute("class", "result-stats js-result-stats");
        let totalResults;
        let currentPage = 1;
        let searchQuery: string;

        const apiKey =
            "8e31e45f4a0e8959d456ba2914723451b8262337f75bcea2e04ae535491df16d"; //API key;

        buttonNext.addEventListener("click", () => {
            currentPage += 1;
            fetchResults(searchQuery);
            document.querySelector(".search-results").animate({ scrollTop: 0 });
        });

        buttonPrevious.addEventListener("click", () => {
            currentPage -= 1;
            fetchResults(searchQuery);
            document.querySelector(".search-results").animate({ scrollTop: 0 });
        });

        function pagination(totalPages: number) {
            buttonNext.classList.remove("hidden");
            if (currentPage >= totalPages) {
                buttonNext.classList.add("hidden");
            }

            buttonPrevious.classList.add("hidden");
            if (currentPage !== 1) {
                buttonPrevious.classList.remove("hidden");
            }
        }

        async function fetchResults(searchQuery: string) {
            spinner.classList.remove("hidden");
            try {
                const results = await searchUnsplash(searchQuery);
                pagination(results.total_pages);
                //console.log(results);
                displayResults(results);
            } catch (err) {
                console.log(err);
                new Notice("Failed to search Unsplash");
            }
            spinner.classList.add("hidden");
        }

        function handleSubmit(event: Event) {
            event.preventDefault();
            currentPage = 1;

            const inputValue: string = (<HTMLInputElement>(
                document.querySelector(".js-search-input")
            )).value;
            searchQuery = inputValue.trim();
            //console.log(searchQuery);
            fetchResults(searchQuery);
        }

        async function searchUnsplash(searchQuery: string) {
            const endpoint = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=30&page=${currentPage}&client_id=${apiKey}`;
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw Error(response.statusText);
            }
            const json = await response.json();
            return json;
        }

        container.appendChild(resultContainer);
        container.appendChild(paginationDiv);

        const searchResultsBox = document.createElement("ul");
        searchResultsBox.setAttribute(
            "class",
            "search-results js-search-results"
        );
        resultContainer.appendChild(searchResultsBox);

        function displayResults(json: {
            total: string;
            results: {
                alt_description: string;
                links: { html: string };
                urls: { raw: string; regular: string };
                user: {
                    links: { html: string };
                    name: string;
                    profile_image: { medium: string };
                };
            }[];
        }) {
            const searchResultsBox = document.querySelector(".search-results");
            searchResultsBox.textContent = "";
            json.results.forEach((result) => {
                const imgDesc = result.alt_description;
                const url = result.urls.regular;
                var rawUrl = result.urls.raw;
                const unsplashLink = result.links.html;
                const photographer = result.user.name;
                const photographerImg = result.user.profile_image.medium;
                const photographerPage = result.user.links.html;

                var resultItem = document.createElement("li");
                resultItem.setAttribute("class", "result-item");
                searchResultsBox.appendChild(resultItem);

                var resultImage = document.createElement("img");
                resultImage.setAttribute("class", "result-image");
                resultImage.setAttribute("src", `${url}`);
                resultImage.setAttribute("alt", `${imgDesc}`);

                var resultInfo = document.createElement("div");
                resultInfo.setAttribute("class", "result-options");

                resultItem.appendChild(resultImage);
                resultItem.appendChild(resultInfo);

                var photographerInfo = document.createElement("span");
                var actionButtons = document.createElement("span");
                photographerInfo.setAttribute("class", "user-info");
                actionButtons.setAttribute("class", "action-buttons");

                resultInfo.appendChild(photographerInfo);
                resultInfo.appendChild(actionButtons);

                var photographerPic = document.createElement("img");
                var photographerName = document.createElement("text");
                photographerPic.setAttribute("src", `${photographerImg}`);
                photographerPic.setAttribute("alt", `${photographer}`);
                photographerName.setAttribute("class", "photographer-name");
                photographerName.innerHTML = `${photographer}`;

                photographerInfo.appendChild(photographerPic);
                photographerInfo.appendChild(photographerName);

                var actionButton = document.createElement("span");
                var zoomButton = document.createElement("span");
                actionButton.setAttribute("class", "action-button");
                zoomButton.setAttr("class", "action-button");
                actionButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><title>Download Icon</title><path d="M12 16l4-5h-3V4h-2v7H8z" fill="currentColor"/><path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z" fill="currentColor"/></svg>`;
                zoomButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><title>Wand Icon</title><path d="M11 4l-.5-1l-.5 1l-1 .125l.834.708L9.5 6l1-.666l1 .666l-.334-1.167l.834-.708zm8.334 10.666L18.5 13l-.834 1.666l-1.666.209l1.389 1.181L16.834 18l1.666-1.111L20.166 18l-.555-1.944L21 14.875zM6.667 6.333L6 5l-.667 1.333L4 6.5l1.111.944L4.667 9L6 8.111L7.333 9l-.444-1.556L8 6.5zM3.414 17c0 .534.208 1.036.586 1.414L5.586 20c.378.378.88.586 1.414.586s1.036-.208 1.414-.586L20 8.414c.378-.378.586-.88.586-1.414S20.378 5.964 20 5.586L18.414 4c-.756-.756-2.072-.756-2.828 0L4 15.586c-.378.378-.586.88-.586 1.414zM17 5.414L18.586 7L15 10.586L13.414 9L17 5.414z" fill="currentColor"/></svg>`;

                actionButtons.appendChild(zoomButton);
                actionButtons.appendChild(actionButton);

                //const extension = this.response.urls.raw.match(/\.[^\.]*$/);

                actionButton.addEventListener("click", () => {
                    (async function () {
                        let blob = await fetch(`${url}`).then((r) => r.blob());
                        let dataUrl = await new Promise((resolve) => {
                            let reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        });
                        const buf = await blob.arrayBuffer();
                        let fileExtension = blob.type.split("/").pop();
                        function saveThisAsImage() {
                            const arrBuff = buf;
                            // Add the current datetime to the image name
                            const now = window
                                .moment()
                                .format("YYYY-MM-DD HHmmss");
                            // Image name from unsplash alt description
                            const imgName = `${imgDesc}`;
                            // Folder path to save img
                            const folderPath =
                                settings.folderPath === ""
                                    ? "/"
                                    : settings.folderPath;
                            var copyText = `![[${imgName} ${now}.${fileExtension}]]`;

                            if (validFolderPathQ(folderPath)) {
                                //@ts-ignore
                                app.vault.createBinary(
                                    `${folderPath}/${imgName} ${now}.${fileExtension}`,
                                    arrBuff
                                );
                                new Notice("Image saved  🥳");
                            } else {
                                new Notice(
                                    "Chosen folder path does not exist in your vault"
                                );
                            }

                            navigator.clipboard.writeText(copyText).then(
                                function () {
                                    new Notice("Link to image in clipboard");
                                },
                                function (err) {
                                    new Notice("Couldn't get image");
                                }
                            );
                        }
                        console.log(fileExtension);
                        //console.log(blob);
                        //console.log(buf);
                        saveThisAsImage();
                    })();
                });

                zoomButton.addEventListener("mousedown", () => {
                    //console.log(extension);
                    var imageToZoom = resultImage;
                    imageToZoom.setAttribute(
                        "style",
                        "display: block; z-index: 100; position: fixed; max-height: calc(100% + 25px); height: calc(100% + 1px); width: 100%; object-fit: contain; margin: -0.5px auto 0; text-align: center; top: 50%; transform: translateY(-50%); padding: 0; left: 0; right: 0; bottom: 0; mix-blend-mode: normal; background-color: var(--background-secondary);"
                    );
                });
                resultImage.addEventListener("mousedown", () => {
                    var imageToZoom = resultImage;
                    imageToZoom.setAttribute("style", "");
                });
            });

            totalResults = json.total;
            resultStats.textContent = `About ${totalResults} images were found`;
        }

        containerMain.empty();
        containerMain.appendChild(container);
    }
}

type iconsPlot = {
    [key: string]: string;
};

const icons: iconsPlot = {
    unsplashicon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h5v4h6v-4h5v9H4zm5-7h6v4H9z" fill="none" stroke="currentColor"/></svg>`,
};

const addIcons = () => {
    Object.keys(icons).forEach((key) => {
        obsidian.addIcon(key, icons[key]);
    });
};

class ObsplashSettingsTab extends PluginSettingTab {
    plugin: Obsplash;

    constructor(app: App, plugin: Obsplash) {
        super(app, plugin);
        //this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h2", { text: "Obsplash Settings" });

        new Setting(containerEl)
            .setName("Unsplash APIKey")
            .setDesc("Use this link to get your custom APIKey")
            .addText((text) =>
                text
                    .setPlaceholder("APIKey")
                    .setValue("")
                    .onChange(async (value) => {
                        console.log("Received Unsplash APIKey");
                        this.plugin.settings.apiKey = value;
                        await this.plugin.saveSettings();
                    })
            );
        new Setting(containerEl)
            .setName("Folder path")
            .setDesc(
                'This is the path to by which to save your images. The default is the root of your vault \'/\'. If you do wish it, leave out the first slash in front. e.g. To save the image in "Images," type in "Images" (no quotes). To save an image to "VAULT NAME/Attachments/Images," type in "Attachments/Images."'
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
            .setDesc(
                "This will allow you to set a default for how you'd like to embed your drag 'n drop images."
            )
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

        const credit = document.createElement("p");
        const donateText = document.createElement("p");
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
        return __awaiter(this, void 0, void 0, function* () {
            yield this.plugin.saveSettings();
        });
    }
}

const createDonateButton = (link: string): HTMLElement => {
    const a = document.createElement("a");
    a.setAttribute("href", link);
    a.innerHTML = `<img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=chetachi&button_colour=e3e7ef&font_colour=262626&font_family=Inter&outline_colour=262626&coffee_colour=ff0000">`;
    return a;
};

export default class Obsplash extends Plugin {
    settings: ObsplashSettings;
    apiKey: string;
    embedType: string;

    get view() {
        let leaf = (
            this.app.workspace.getLeavesOfType(Obsplash_View_) ?? []
        ).shift();
        if (leaf && leaf.view && leaf.view instanceof ObsplashView)
            return leaf.view;
    }

    async onload() {
        addIcons();

        await this.loadSettings();
        console.log("Obsplash v" + this.manifest.version + " loaded");

        this.addSettingTab(new ObsplashSettingsTab(this.app, this));

        this.registerView(
            Obsplash_View_,
            (leaf: WorkspaceLeaf) =>
                new ObsplashView(
                    leaf,
                    this,
                    this.app,
                    this.settings,
                    this.apiKey
                )
        );

        this.addCommand({
            id: "open-obsplash-view",
            name: "Open Obsplash View",
            callback: async () => {
                if (
                    this.app.workspace.getLeavesOfType(Obsplash_View_).length ==
                    0
                ) {
                    await this.app.workspace.getRightLeaf(false).setViewState({
                        type: Obsplash_View_,
                    });
                }
                this.app.workspace.revealLeaf(
                    this.app.workspace.getLeavesOfType(Obsplash_View_).first()
                );
            },
        });

        if (this.app.workspace.layoutReady) {
            this.addObsplashView();
        } else {
            this.registerEvent(
                this.app.workspace.on(
                    "layout-ready",
                    this.addObsplashView.bind(this)
                )
            );
        }

        this.app.workspace.onLayoutReady(() => {
            this.registerCodeMirror((cm: CodeMirror.Editor) => {
                cm.on("drop", (instance, event) => {
                    const data = event.dataTransfer;
                    const html = data.getData("text/html");
                    const match = html.match(/src\s*=\s*"(.+?)"/);
                    if (match == undefined) {
                        console.log("Datatransfer unsuccessful 🤷🏽‍♀️");
                        return;
                    }
                    if (match.length) {
                        const coords = instance.coordsChar(
                            { left: event.clientX, top: event.clientY },
                            "window"
                        );
                        if (DEFAULT_SETTINGS.embedType === "HTML") {
                            instance.replaceRange(
                                `<img src="${match[1]}">`,
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

    destroy(): void {
        var currentView = document.querySelector(".obsplash-view-container");
        currentView.remove;
    }

    initLeaf(workspace: Workspace): void {
        if (workspace.getLeavesOfType("obsplash").length == 0) {
            workspace.getRightLeaf(false).setViewState({
                type: "obsplash",
            });
        }
    }
    onunload() {
        this.app.workspace
            .getLeavesOfType(Obsplash_View_)
            .forEach((leaf) => leaf.detach());
        console.log("Obsplash unloaded");
    }

    addObsplashView() {
        if (this.app.workspace.getLeavesOfType(Obsplash_View_).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: Obsplash_View_,
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

module.exports = Obsplash;
