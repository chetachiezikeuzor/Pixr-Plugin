import React from "react";
import { Icon } from "@iconify/react";
import { bytesToSize } from "../util/utils";

const StatsIcons = ({ likes, downloads, views, size }: any) => {
    const style = {
        height: "auto",
        width: "inherit",
        alignItems: "center",
        fontSize: "16.5px",
        cursor: "pointer",
        padding: ".36rem .85rem",
        Clear: "both",
        fontWeight: 500,
        TextAlign: "inherit",
        TextDecoration: "none",
        WhiteSpace: "nowrap",
        gridGap: "8px",
        justifyContent: "start",
        backgroundColor: "transparent",
        borderRadius: 0,
    };

    return (
        <>
            <span
                style={Object.assign(
                    {
                        border: 0,
                        color: "rgba(var(--color-size-pixr),1)",
                        borderBottom:
                            "1px solid var(--background-modifier-border)",
                    },
                    style
                )}
                className="action-button"
            >
                <Icon icon="ri:image-line" aria-label={"Image Icon"} />{" "}
                <span> {size ? bytesToSize(size) : bytesToSize(0)}</span>
            </span>

            <span
                style={Object.assign(
                    {
                        border: 0,
                        color: "rgba(var(--color-views-pixr),1)",
                        borderBottom:
                            "1px solid var(--background-modifier-border)",
                    },
                    style
                )}
                className="action-button"
            >
                <Icon icon="fa-regular:eye" aria-label={"View Icon"} />{" "}
                <span>{views ? new Intl.NumberFormat().format(views) : 0}</span>
            </span>

            <span
                style={Object.assign(
                    {
                        border: 0,
                        color: "rgba(var(--color-downloads-pixr),1)",
                        borderBottom:
                            "1px solid var(--background-modifier-border)",
                    },
                    style
                )}
                className="action-button"
            >
                <Icon icon="bx:bx-download" aria-label={"Download Icon"} />{" "}
                <span>
                    {" "}
                    {downloads ? new Intl.NumberFormat().format(downloads) : 0}
                </span>
            </span>

            <span
                style={Object.assign(
                    {
                        border: 0,
                        color: "rgba(var(--color-likes-pixr),1)",
                    },
                    style
                )}
                className="action-button"
            >
                <Icon icon="akar-icons:heart" aria-label={"Heart Icon"} />{" "}
                <span>
                    {" "}
                    {likes ? new Intl.NumberFormat().format(likes) : 0}
                </span>
            </span>
        </>
    );
};

export default StatsIcons;
