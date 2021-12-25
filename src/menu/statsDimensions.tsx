import React from "react";

const StatsDimensions = ({ photo, dimensions }: any) => {
    const style = {
        height: "fit-content",
        alignItems: "center",
        cursor: "pointer",
        color: "var(--text-on-accent)",
        position: "absolute" as "absolute",
        padding: "0",
        Clear: "both",
        fontWeight: 900,
        TextAlign: "inherit",
        TextDecoration: "none",
        WhiteSpace: "nowrap",
        gridGap: "8px",
        justifyContent: "start",
        backgroundColor: "transparent",
        borderRadius: 0,
        margin: "auto",
        display: "block",
        bottom: "0px",
    };
    const image = {
        height: "100%",
        minWidth: "100%",
        overflow: "hidden",
        cursor: "pointer",
        objectFit: "cover",
        filter: "brightness(0.85) blur(3px)",
        position: "relative" as "relative",
        verticalAlign: "bottom",
    };
    return (
        <>
            <div
                style={Object.assign({
                    maxWidth: "9.8rem",
                    height: "165px",
                    flexGrow: 1,
                    overflow: "hidden",
                })}
            >
                <img
                    style={Object.assign(image, { maxWidth: "8.9rem" })}
                    src={photo.urls.regular}
                ></img>

                <span
                    style={Object.assign(
                        {
                            fontSize: "medium",
                            textAlign: "center",
                            width: "100%",
                            top: "8px",
                        },
                        style
                    )}
                >
                    {dimensions.width} x {dimensions.height} px
                </span>

                <span
                    style={Object.assign(
                        {
                            transform: "translate(-50%, 26px)",
                            fontSize: "12px",
                            width: "fit-content",
                            left: "50%",
                            top: 0,
                        },
                        style
                    )}
                >
                    intrinsic
                </span>
            </div>
        </>
    );
};

export default StatsDimensions;
