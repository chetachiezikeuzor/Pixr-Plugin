import * as CodeMirror from "codemirror";
import {
    App,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting,
    Workspace,
    ItemView,
    WorkspaceLeaf,
    TFolder,
    TAbstractFile,
    FileSystemAdapter,
} from "obsidian";

var obsidian = require("obsidian");

const MultiPix_View_ = "multipix-view-container";

const EMBED_TYPES = ["Markdown", "HTML"] as const;

type Embed = typeof EMBED_TYPES[number];

interface MultiPixSettings {
    mySetting: string;
    apiKey: string;
    folderPath: string;
    embedType: Embed;
}

const DEFAULT_SETTINGS: MultiPixSettings = {
    mySetting: "default",
    apiKey: "",
    folderPath: "/",
    embedType: "Markdown",
};

class MultiPixView extends ItemView {
    app: App;
    apiKey = "";
    plugin: MultiPix;
    settings: MultiPixSettings;

    constructor(
        leaf: WorkspaceLeaf,
        plugin: MultiPix,
        app: App,
        settings: MultiPixSettings,
        apiKey: string
    ) {
        super(leaf);
        this.plugin = plugin;
        this.app = app;
        this.settings = settings;
        this.apiKey = apiKey;
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

        const container = createEl("div");
        const form = createEl("form");
        const resultStats = createEl("div");
        const backToTopBar = createEl("div");

        container.setAttribute("class", "multipix-view-container");
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

        const resultContainer = createEl("div");
        const paginationDiv = createEl("div");
        const buttonNext = createEl("a");
        const buttonPrevious = createEl("a");

        const spinner = createEl("div");
        const bounce1 = createEl("div");
        const bounce2 = createEl("div");

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

        const apiKey = "TjzU95V4JHVry7D_iigag7nKd940el7fMBB9KgBLpRY"; //API key;

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
                new Notice("Failed to search");
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

        const searchResultsBox = createEl("ul");
        searchResultsBox.setAttribute(
            "class",
            "search-results js-search-results"
        );
        resultContainer.appendChild(searchResultsBox);

        function displayResults(json: {
            total: string;
            results: {
                id: string;
                alt_description: string;
                downloads: number;
                user: {
                    name: string;
                    downloads: number;
                    profile_image: { medium: string };
                    links: { html: string; photos: string };
                };
                urls: { raw: string; regular: string };
                links: {
                    html: string;
                    download: string;
                    download_location: string;
                };
            }[];
        }) {
            const searchResultsBox = document.querySelector(".search-results");
            searchResultsBox.textContent = "";
            json.results.forEach((result) => {
                const downloadUrl = result.links.download_location;
                const imgDesc = result.alt_description;
                const imageUrl = result.urls.regular;
                const unsplashLink = result.links.html;
                const photographer = result.user.name;
                const photographerImg = result.user.profile_image.medium;
                const photographerPage = result.user.links.html;

                var resultItem = createEl("li");
                resultItem.setAttribute("class", "result-item");
                searchResultsBox.appendChild(resultItem);

                var resultImage = createEl("img");
                resultImage.setAttribute("class", "result-image");
                resultImage.setAttribute("src", `${imageUrl}`);
                resultImage.setAttribute("alt", `${imgDesc}`);

                var resultInfo = createEl("div");
                resultInfo.setAttribute("class", "result-options");

                var externalLink = createEl("a");
                externalLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><title>External Link Icon</title><path d="M13 3l3.293 3.293l-7 7l1.414 1.414l7-7L21 11V3z"/><path d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z"/></svg>`;
                externalLink.setAttribute(
                    "style",
                    "position: absolute; top: 3px; right: 6px; z-index: 2;"
                );
                externalLink.setAttribute("class", "externalLinkIcon");
                externalLink.setAttribute("href", `${unsplashLink}`);
                resultItem.appendChild(externalLink);

                resultItem.appendChild(resultImage);
                resultItem.appendChild(resultInfo);

                var photographerInfo = createEl("span");
                var actionButtons = createEl("span");
                photographerInfo.setAttribute("class", "user-info");
                actionButtons.setAttribute("class", "action-buttons");

                resultInfo.appendChild(photographerInfo);
                resultInfo.appendChild(actionButtons);

                var photographerPic = createEl("img");
                var photographerName = document.createElement("text");
                photographerPic.setAttribute("src", `${photographerImg}`);
                photographerPic.setAttribute("alt", `${photographer}`);
                photographerName.setAttribute("class", "photographer-name");
                photographerName.innerHTML = `<a href="${photographerPage}?utm_source=multipix&utm_medium=referral">${photographer}</a> on <a href="https://unsplash.com/?utm_source=multipix&utm_medium=referral">Unsplash</a>`;

                photographerInfo.appendChild(photographerPic);
                photographerInfo.appendChild(photographerName);

                var downloadButton = createEl("span");
                var zoomButton = createEl("span");
                downloadButton.setAttribute("class", "action-button");
                zoomButton.setAttr("class", "action-button");
                downloadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><title>Download Icon</title><path d="M12 16l4-5h-3V4h-2v7H8z" fill="currentColor"/><path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z" fill="currentColor"/></svg>`;
                zoomButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><title>Wand Icon</title><path d="M11 4l-.5-1l-.5 1l-1 .125l.834.708L9.5 6l1-.666l1 .666l-.334-1.167l.834-.708zm8.334 10.666L18.5 13l-.834 1.666l-1.666.209l1.389 1.181L16.834 18l1.666-1.111L20.166 18l-.555-1.944L21 14.875zM6.667 6.333L6 5l-.667 1.333L4 6.5l1.111.944L4.667 9L6 8.111L7.333 9l-.444-1.556L8 6.5zM3.414 17c0 .534.208 1.036.586 1.414L5.586 20c.378.378.88.586 1.414.586s1.036-.208 1.414-.586L20 8.414c.378-.378.586-.88.586-1.414S20.378 5.964 20 5.586L18.414 4c-.756-.756-2.072-.756-2.828 0L4 15.586c-.378.378-.586.88-.586 1.414zM17 5.414L18.586 7L15 10.586L13.414 9L17 5.414z" fill="currentColor"/></svg>`;

                actionButtons.appendChild(zoomButton);
                actionButtons.appendChild(downloadButton);

                downloadButton.addEventListener("click", () => {
                    (async function () {
                        let blob = await fetch(`${imageUrl}`).then((r) =>
                            r.blob()
                        );
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

                                new Notice("The image was saved  🥳");

                                async function fetchDownload() {
                                    try {
                                        const result = await fetch(
                                            downloadUrl,
                                            {
                                                headers: {
                                                    Authorization: `Client-ID ${apiKey}`,
                                                },
                                            }
                                        );
                                        console.log(result);
                                    } catch (err) {
                                        console.log(err);
                                        new Notice(
                                            `Something bad happened: ${err}`
                                        );
                                    }
                                }
                                fetchDownload();
                            } else {
                                new Notice(
                                    "The chosen folder path does not exist in your vault"
                                );
                            }

                            navigator.clipboard.writeText(copyText).then(
                                function () {
                                    new Notice(
                                        "The image link is in your clipboard"
                                    );
                                },
                                function (err) {
                                    new Notice("There was a problem!" + err);
                                }
                            );
                        }
                        saveThisAsImage();
                    })();
                });

                zoomButton.addEventListener("mousedown", () => {
                    var imageToZoom = resultImage;
                    imageToZoom.setAttribute(
                        "style",
                        "display: block; z-index: 100; position: fixed; max-height: calc(100% + 25px); height: calc(100% + 1px); width: 100%; object-fit: contain; margin: 0 auto; text-align: center; top: 50%; transform: translateY(-50%); padding: 0; left: 0; right: 0; bottom: 0; mix-blend-mode: normal; background-color: var(--background-secondary);"
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
    multipixicon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"><g><polygon points="83.203,33.262 87.075,42.61 90.653,42.61 90.651,79.427 61.912,79.427 39.337,88.779 100,88.779 100,33.262  "></polygon></g><g><path d="M0,38.235l67.019-27.76l21.242,51.291l-67.015,27.76L0,38.235z M26.305,77.309l49.741-20.601L61.958,22.69L12.215,43.293   L26.305,77.309z"></path></g></svg>`,
};

const addIcons = () => {
    Object.keys(icons).forEach((key) => {
        obsidian.addIcon(key, icons[key]);
    });
};

class MultiPixSettingsTab extends PluginSettingTab {
    plugin: MultiPix;

    constructor(app: App, plugin: MultiPix) {
        super(app, plugin);
        //this.plugin = plugin;
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

export default class MultiPix extends Plugin {
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
                new MultiPixView(
                    leaf,
                    this,
                    this.app,
                    this.settings,
                    this.apiKey
                )
        );

        this.addCommand({
            id: "open-multipix-view",
            name: "Open MultiPix View",
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
