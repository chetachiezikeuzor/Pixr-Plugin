import React from "react";
import { bytesToSize } from "../util/utils";
import { STATS_ICONS_STYLE } from "../util/constants";

const StatsIcons = ({ likes, downloads, views, size }: any) => {
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
                    STATS_ICONS_STYLE
                )}
                className="action-button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                >
                    <title>Image Icon</title>
                    <path
                        d="M4.828 21l-.02.02l-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4a2 2 0 0 1 0 4z"
                        fill="currentColor"
                    />
                </svg>

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
                    STATS_ICONS_STYLE
                )}
                className="action-button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1.13em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 576 512"
                >
                    <title>View Icon</title>
                    <path
                        d="M288 144a110.94 110.94 0 0 0-31.24 5a55.4 55.4 0 0 1 7.24 27a56 56 0 0 1-56 56a55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"
                        fill="currentColor"
                    />
                </svg>

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
                    STATS_ICONS_STYLE
                )}
                className="action-button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                >
                    <title>Download Icon</title>
                    <path d="M12 16l4-5h-3V4h-2v7H8z" fill="currentColor" />
                    <path
                        d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"
                        fill="currentColor"
                    />
                </svg>

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
                    STATS_ICONS_STYLE
                )}
                className="action-button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                >
                    <title>Heart Icon</title>
                    <g fill="none">
                        <path
                            d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.985.985 0 0 0 1.024 0C21.125 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                </svg>
                <span>
                    {" "}
                    {likes ? new Intl.NumberFormat().format(likes) : 0}
                </span>
            </span>
        </>
    );
};

export default StatsIcons;
