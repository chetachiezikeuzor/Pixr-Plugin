import React from "react";
import parse from "html-react-parser";
import { icons } from "../icons/customIcons";

const PixrNoKey = () => {
    return (
        <>
            <div className="pixr-error-position-relative pixr-error-wrapper-container">
                <div className="pixr-error-opacity-change pixr-error-opacity-100 pixr-error-position-relative">
                    <div style={{ paddingBottom: "56.25%" }}></div>
                </div>
                <div className="pixr-error-position-absolute-wrapper">
                    <div className="pixr-error-wrapper">
                        <div className="pixr-error-full-width-padding-20"></div>

                        <div className="pixr-error-wrapper-inner">
                            <h1 className="pixr-error-h1 pixr-error-margin-0">
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
                                            a
                                        </span>
                                        <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                            p
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
                                            i
                                        </span>
                                    </div>{" "}
                                    <div className="pixr-error-text-wrap">
                                        <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                            k
                                        </span>
                                        <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                            e
                                        </span>
                                        <span className="pixr-error-text-shadow pixr-error-animation-blur pixr-error-z-index-2">
                                            y
                                        </span>
                                    </div>
                                </>
                            </h1>
                            <p className="pixr-error-paragraph-style pixr-error-paragraph">
                                Please provide your custom api key to begin
                                <br />
                                searching for images.
                            </p>
                            <a>
                                <button
                                    style={{
                                        backgroundColor:
                                            "var(--interactive-accent)",
                                        color: "var(--text-on-accent)",
                                    }}
                                    id="send-button"
                                >
                                    Get api key
                                </button>
                            </a>
                        </div>
                        <div className="pixr-error-justify-sb">
                            <div style={{ textTransform: "uppercase" }}>
                                <a href="https://github.com/chetachiezikeuzor/Pixr-Plugin">
                                    {parse(icons["pixr-icon"])} Pixr Plugin Repo
                                </a>
                            </div>
                            <div>NO API KEY</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PixrNoKey;
