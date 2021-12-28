import React from "react";
import parse from "html-react-parser";
import { icons } from "../icons/customIcons";

const PixrAppError = ({ data, status }: any) => {
    return (
        <>
            <div className="pixr-error-position-relative pixr-error-wrapper-container">
                <div className="pixr-error-opacity-change pixr-error-opacity-100 pixr-error-position-relative">
                    <div style={{ paddingBottom: "56.25%" }}></div>
                </div>
                <div className="pixr-error-position-absolute-wrapper">
                    <div className="pixr-error-wrapper">
                        {status == "ERROR" ? (
                            <div className="pixr-error-full-width-padding-20">
                                <span></span>
                                <div className="pixr-error-unsplash-check">
                                    <div className="pixr-error-red-dot"></div>
                                    <a
                                        className="pixr-error-unsplash-check-link"
                                        href="https://status.unsplash.com"
                                    >
                                        Unsplash Status ↗
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        <div className="pixr-error-wrapper-inner">
                            <h1 className="pixr-error-h1 pixr-error-margin-0">
                                {status == "NO_RESULTS" ? (
                                    <>
                                        <div className="pixr-error-text-wrap">
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                N
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                o
                                            </span>
                                        </div>{" "}
                                        <div className="pixr-error-text-wrap">
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                r
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                e
                                            </span>
                                            <span
                                                className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-animation-opacity pixr-error-z-index-2 pixr-error-animation-transform"
                                                style={{
                                                    transform:
                                                        "rotate3d(0, 0, 1, 16deg)",
                                                    zIndex: "-3",
                                                    animation: "none",
                                                }}
                                            >
                                                s
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                u
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-animation-blur-opacity-min pixr-error-z-index-2">
                                                l
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                t
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                s
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="pixr-error-text-wrap">
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                S
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                h
                                            </span>
                                            <span
                                                className="pixr-error-text-shadow pixr-error-opacity-45 pixr-error-animation-blur pixr-error-animation-blur-opacity-min pixr-error-z-index-2"
                                                style={{
                                                    color: "var(--text-faint)",
                                                }}
                                            >
                                                *
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                t
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                '
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                s
                                            </span>
                                        </div>{" "}
                                        <div className="pixr-error-text-wrap">
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                b
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                r
                                            </span>
                                            <span
                                                className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-animation-opacity pixr-error-z-index-2 pixr-error-animation-transform"
                                                style={{
                                                    transform:
                                                        "rotate3d(0, 0, 1, 18deg)",
                                                    zIndex: "-3",
                                                    animation: "none",
                                                }}
                                            >
                                                o
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                k
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-animation-blur-opacity-min pixr-error-z-index-2">
                                                e
                                            </span>
                                            <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                                n
                                            </span>
                                        </div>
                                    </>
                                )}
                            </h1>
                            {status == "NO_RESULTS" ? (
                                <p className="pixr-error-paragraph-style pixr-error-paragraph">
                                    Unfortunately, your query yielded no
                                    results.
                                    <br />
                                    Try broadening your search.
                                </p>
                            ) : (
                                <p className="pixr-error-paragraph-style pixr-error-paragraph">
                                    Unfortunately, something went wrong. If this
                                    <br />
                                    error is unusual, please submit an issue on
                                    <br />
                                    the repo of this plugin.
                                </p>
                            )}
                        </div>
                        <div className="pixr-error-justify-sb">
                            <div style={{ textTransform: "uppercase" }}>
                                <a
                                    href="https://github.com/chetachiezikeuzor/Pixr-Plugin"
                                    className="eziW_"
                                >
                                    {parse(icons["pixr-icon"])} Pixr Plugin Repo
                                </a>
                            </div>
                            <div>{status.replaceAll("_", " ")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PixrAppError;
