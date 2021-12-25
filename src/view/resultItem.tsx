import React, { useRef, useEffect, useState } from "react";
import {
    capitalizeFirstLetter,
    getImageBlob,
    getImageDimensions,
} from "../util/utils";
import { DROPDOWN_OPTIONS } from "../util/constants";
import { downloadImage } from "../util/utils";
import { Dropdown } from "./dropdown";
import statsMenu from "../menu/statsMenu";
import ConfirmDownloadModal from "src/modals/confirmDownload";

const ResultItem = ({ photo, plugin }: any) => {
    const dropdownRef = useRef<HTMLSelectElement>(null);
    const resultImageRef = useRef<HTMLImageElement>(null);
    const actionButtonsRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(plugin.settings.downloadType);

    useEffect(() => {
        if (dropdownRef.current) {
            setSelected(selected);
        }
    }, []);

    const altDescription = photo.alt_description
        ? photo.alt_description
        : "Unsplash Image";

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
                        <g
                            className="icon-tabler"
                            stroke="currentColor"
                            strokeWidth=".25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M13 3l3.293 3.293l-7 7l1.414 1.414l7-7L21 11V3z" />
                            <path d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z" />
                        </g>
                    </svg>
                </a>
                <img
                    ref={resultImageRef}
                    src={photo.urls.regular}
                    alt={`"${capitalizeFirstLetter(altDescription)}"`}
                    className="result-image"
                    onClick={(e) => {
                        resultImageRef.current.setAttribute("style", "");
                    }}
                />
                <div className="result-options">
                    <span className="user-info">
                        <img
                            src={photo.user.profile_image.medium}
                            alt={capitalizeFirstLetter(photo.user.name)}
                        />
                        <span className="photographer-name">
                            <a
                                href={`${photo.user.links.html}?utm_source=pixr&utm_medium=referral`}
                            >
                                {capitalizeFirstLetter(photo.user.name)}
                            </a>{" "}
                            on{" "}
                            <a
                                href={`https://unsplash.com/?utm_source=pixr&utm_medium=referral`}
                            >
                                Unsplash
                            </a>
                        </span>
                    </span>
                    <span className="action-buttons" ref={actionButtonsRef}>
                        <Dropdown
                            plugin={plugin}
                            innerRef={dropdownRef}
                            options={DROPDOWN_OPTIONS}
                            selected={selected}
                            onSelectedChange={(e) => {
                                setSelected(selected);
                            }}
                        />
                        <span
                            className="action-button"
                            onClick={(e) =>
                                downloadImage(
                                    e,
                                    photo.urls[
                                        dropdownRef.current.options[
                                            dropdownRef.current.selectedIndex
                                        ].value
                                    ],
                                    altDescription,
                                    dropdownRef,
                                    plugin
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
                                <g
                                    className="icon-tabler"
                                    stroke="currentColor"
                                    strokeWidth=".25"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path
                                        d="M12 16l4-5h-3V4h-2v7H8z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"
                                        fill="currentColor"
                                    />
                                </g>
                            </svg>
                        </span>
                        <span
                            className="action-button"
                            onClick={(e) =>
                                resultImageRef.current.setAttribute(
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
                                <title>Resize Icon</title>
                                <g
                                    className="icon-tabler"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.25"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 11v8a1 1 0 0 0 1 1h8M4 6V5a1 1 0 0 1 1-1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1-1 1h-1" />
                                    <path d="M4 12h7a1 1 0 0 1 1 1v7" />
                                </g>
                            </svg>
                        </span>

                        <span
                            className="action-button"
                            onClick={async (e) =>
                                statsMenu(
                                    plugin.app,
                                    actionButtonsRef.current,
                                    photo,
                                    await getImageBlob(
                                        photo.urls[
                                            dropdownRef.current.options[
                                                dropdownRef.current
                                                    .selectedIndex
                                            ].value
                                        ]
                                    ),
                                    await getImageDimensions(
                                        photo.urls[
                                            dropdownRef.current.options[
                                                dropdownRef.current
                                                    .selectedIndex
                                            ].value
                                        ]
                                    )
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
                                <title>Info Icon</title>
                                <g
                                    className="icon-tabler"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 8h.01" />
                                    <path d="M11 12h1v4h1" />
                                </g>
                            </svg>
                        </span>
                    </span>
                </div>
            </li>
        </>
    );
};
export default ResultItem;
