import React from "react";
import { Notice } from "obsidian";
import { validFolderPathQ } from "../util/utils";
import { fetchDownload } from "../util/utils";

const ResultItem = ({ photo, plugin }: any) => {
    const downloadImage = (
        e: any,
        imageURL: string,
        imageDesc: string,
        downloadURL: string
    ) => {
        (async function () {
            let blob = await fetch(`${imageURL}`).then((r) => r.blob());
            let fileExtension = blob.type.split("/").pop();

            async function saveThisAsImage() {
                const arrBuff = await blob.arrayBuffer();
                const now = window.moment().format("YYYY-MM-DD HHmmss");
                const imgName = `${imageDesc}`;
                const folderPath =
                    plugin.settings.folderPath === ""
                        ? "/"
                        : plugin.settings.folderPath;
                var copyText = `![[${imgName} ${now}.${fileExtension}]]`;

                if (validFolderPathQ(folderPath, plugin)) {
                    plugin.app.vault.createBinary(
                        `${folderPath}/${imgName} ${now}.${fileExtension}`,
                        arrBuff
                    );
                    new Notice("The image was saved  🥳");
                    fetchDownload(downloadURL);
                    try {
                        await navigator.clipboard.writeText(copyText);
                        new Notice("The image link is in your clipboard");
                    } catch (err) {
                        new Notice("There was a problem!" + err);
                    }
                } else {
                    new Notice(
                        "The chosen folder path does not exist in your vault"
                    );
                }
            }
            saveThisAsImage();
        })();
    };

    return (
        <>
            <li key={photo.id} className="result-item">
                <a
                    className="externalLinkIcon"
                    style={{
                        position: "absolute",
                        top: "3px",
                        right: "6px",
                        zIndex: "2",
                    }}
                    href={photo.links.html}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        width="1em"
                        height="1em"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                    >
                        <title>External Link Icon</title>
                        <path d="M13 3l3.293 3.293l-7 7l1.414 1.414l7-7L21 11V3z" />
                        <path d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z" />
                    </svg>
                </a>
                <img
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                    className="result-image"
                    onClick={(e) => {
                        e.currentTarget.setAttribute("style", "");
                    }}
                />
                <div className="result-options">
                    <span className="user-info">
                        <img
                            src={photo.user.profile_image.medium}
                            alt={photo.user.name}
                        />
                        <span className="photographer-name">
                            <a
                                href={`${photo.user.links.html}?utm_source=multipix&utm_medium=referral`}
                            >
                                {photo.user.name}
                            </a>{" "}
                            on{" "}
                            <a
                                href={`https://unsplash.com/?utm_source=multipix&utm_medium=referral`}
                            >
                                Unsplash
                            </a>
                        </span>
                    </span>
                    <span className="action-buttons">
                        <span
                            className="action-button"
                            onClick={(e) =>
                                downloadImage(
                                    e,
                                    photo.urls.regular,
                                    photo.alt_description,
                                    photo.links.download_location
                                )
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                focusable="false"
                                width="1em"
                                height="1em"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 24 24"
                            >
                                <title>Download Icon</title>
                                <path
                                    d="M12 16l4-5h-3V4h-2v7H8z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"
                                    fill="currentColor"
                                />
                            </svg>
                        </span>
                        <span
                            className="action-button"
                            onClick={(e) =>
                                e.currentTarget.parentElement.parentElement.parentElement
                                    .querySelector(".result-image")
                                    .setAttribute(
                                        "style",
                                        "display: block; z-index: 100; position: fixed; max-height: calc(100% + 25px); height: calc(100% + 1px); width: 100%; object-fit: contain; margin: 0 auto; text-align: center; top: 50%; transform: translateY(-50%); padding: 0; left: 0; right: 0; bottom: 0; mix-blend-mode: normal; background-color: var(--background-secondary);"
                                    )
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                focusable="false"
                                width="1em"
                                height="1em"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 24 24"
                            >
                                <title>Wand Icon</title>
                                <path
                                    d="M11 4l-.5-1l-.5 1l-1 .125l.834.708L9.5 6l1-.666l1 .666l-.334-1.167l.834-.708zm8.334 10.666L18.5 13l-.834 1.666l-1.666.209l1.389 1.181L16.834 18l1.666-1.111L20.166 18l-.555-1.944L21 14.875zM6.667 6.333L6 5l-.667 1.333L4 6.5l1.111.944L4.667 9L6 8.111L7.333 9l-.444-1.556L8 6.5zM3.414 17c0 .534.208 1.036.586 1.414L5.586 20c.378.378.88.586 1.414.586s1.036-.208 1.414-.586L20 8.414c.378-.378.586-.88.586-1.414S20.378 5.964 20 5.586L18.414 4c-.756-.756-2.072-.756-2.828 0L4 15.586c-.378.378-.586.88-.586 1.414zM17 5.414L18.586 7L15 10.586L13.414 9L17 5.414z"
                                    fill="currentColor"
                                />
                            </svg>
                        </span>
                    </span>
                </div>
            </li>
        </>
    );
};
export default ResultItem;
