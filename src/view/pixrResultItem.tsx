import {
    capitalizeFirstLetter,
    downloadImage,
    getImageBlob,
    getImageDimensions,
} from "../util/utils";
import { useModal } from "../util/hooks";
import statsMenu from "../menu/statsMenu";
import { DROPDOWN_OPTIONS } from "../util/constants";
import React, { useRef, useEffect, useState } from "react";
import { DownloadConfirmModal } from "../modal/downloadConfirmModal";

const PixrResultItem = ({ photo, plugin }: any) => {
    const mounted = useRef(false);
    const dropdownRef = useRef<HTMLSelectElement>(null);
    const resultImageRef = useRef<HTMLImageElement>(null);
    const actionButtonsRef = useRef<HTMLDivElement>(null);
    const parentElementRef = useRef<HTMLLIElement>(null);
    const [selected, setSelected] = useState(null);
    const [dimensions, setDimensions] = useState(null);
    const [chosenImgUrl, setChosenImgUrl] = useState();
    const [blob, setBlob] = useState(null);
    const { isShowing, toggle } = useModal();

    const [labels, setLabels] = useState(Object.keys(DROPDOWN_OPTIONS));
    const [values, setValues] = useState(Object.values(DROPDOWN_OPTIONS));

    const selectLabels = labels.map((selectLabels) => selectLabels);
    const selectValues = values.map((selectValues) => selectValues);

    const handleNewSelection = (e: any) => {
        setChosenImgUrl(photo.urls[DROPDOWN_OPTIONS[e.target.value]]);
        setSelected(selectLabels.find((el) => el === e.target.value));
    };

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (dropdownRef.current) {
            setChosenImgUrl(
                photo.urls[
                    DROPDOWN_OPTIONS[
                        dropdownRef.current.options[
                            dropdownRef.current.selectedIndex
                        ].value
                    ]
                ]
            );
            getImageBlob(
                photo.urls[
                    DROPDOWN_OPTIONS[
                        dropdownRef.current.options[
                            dropdownRef.current.selectedIndex
                        ].value
                    ]
                ]
            ).then((blob) => {
                if (mounted.current) setBlob(blob);
            });
            getImageDimensions(
                photo.urls[
                    DROPDOWN_OPTIONS[
                        dropdownRef.current.options[
                            dropdownRef.current.selectedIndex
                        ].value
                    ]
                ]
            ).then((blob) => {
                if (mounted.current) setDimensions(blob);
            });
        }
    }, []);

    const altDescription = photo.alt_description
        ? photo.alt_description
        : "Unsplash Image";

    return (
        <>
            <li
                key={photo.id}
                className="pixr-result-item"
                ref={parentElementRef}
            >
                {plugin.settings.showDownloadConfirmationModal == true ? (
                    <DownloadConfirmModal
                        isShowing={isShowing}
                        hide={toggle}
                        showDownloadConfirmationModal={true}
                        parentElement={parentElementRef.current}
                        imgTitle={altDescription}
                        imgUrl={photo.urls.regular}
                        chosenImgUrl={chosenImgUrl}
                        blob={blob}
                        plugin={plugin}
                        dimensions={dimensions}
                    />
                ) : null}

                <a
                    className="pixr-external-link-icon"
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
                    id={photo.id}
                    ref={resultImageRef}
                    src={photo.urls.regular}
                    alt={`"${capitalizeFirstLetter(altDescription)}"`}
                    className="pixr-result-image"
                    onClick={(e) => {
                        resultImageRef.current.setAttribute("style", "");
                    }}
                />
                <div className="pixr-result-options">
                    <span className="pixr-user-info">
                        <img
                            src={photo.user.profile_image.medium}
                            alt={capitalizeFirstLetter(photo.user.name)}
                        />
                        <span className="pixr-photographer-name">
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
                    <span
                        className="pixr-action-buttons-container"
                        ref={actionButtonsRef}
                    >
                        <select
                            ref={dropdownRef}
                            defaultValue={plugin.settings.downloadType}
                            onChange={async (e) => {
                                handleNewSelection(e);
                                setBlob(
                                    await getImageBlob(
                                        photo.urls[
                                            DROPDOWN_OPTIONS[e.target.value]
                                        ]
                                    )
                                );
                                setDimensions(
                                    await getImageDimensions(
                                        photo.urls[
                                            DROPDOWN_OPTIONS[e.target.value]
                                        ]
                                    )
                                );
                            }}
                            style={{
                                paddingTop: "1.5px",
                                paddingBottom: "2px",
                                minWidth: "90px",
                            }}
                            className="dropdown pixr-action-button"
                        >
                            {selectLabels.map((value, key) => (
                                <option
                                    key={key}
                                    className="item"
                                    value={value}
                                >
                                    {value}
                                </option>
                            ))}
                        </select>

                        <span
                            className="pixr-action-button"
                            onClick={(e) => {
                                plugin.settings.showDownloadConfirmationModal
                                    ? toggle()
                                    : downloadImage(
                                          e,
                                          photo.urls[
                                              DROPDOWN_OPTIONS[
                                                  dropdownRef.current.options[
                                                      dropdownRef.current
                                                          .selectedIndex
                                                  ].value
                                              ]
                                          ],
                                          capitalizeFirstLetter(altDescription),
                                          plugin,
                                          photo.id
                                      );
                            }}
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
                            className="pixr-action-button"
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
                            className="pixr-action-button"
                            onClick={async (e) => {
                                statsMenu(
                                    plugin.app,
                                    actionButtonsRef.current,
                                    photo,
                                    await getImageBlob(
                                        photo.urls[
                                            DROPDOWN_OPTIONS[
                                                dropdownRef.current.options[
                                                    dropdownRef.current
                                                        .selectedIndex
                                                ].value
                                            ]
                                        ]
                                    ),

                                    await getImageDimensions(
                                        photo.urls[
                                            DROPDOWN_OPTIONS[
                                                dropdownRef.current.options[
                                                    dropdownRef.current
                                                        .selectedIndex
                                                ].value
                                            ]
                                        ]
                                    )
                                );
                            }}
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
export default PixrResultItem;
