import React from "react";
import {
    STATS_DIMENSIONS_STYLE,
    STATS_DIMENSIONS_IMG_STYLE,
} from "../util/constants";

const StatsDimensions = ({ photo, dimensions }: any) => {
    return (
        <div
            style={Object.assign({
                maxWidth: "9.6rem",
                height: "165px",
                flexGrow: 1,
                overflow: "hidden",
            })}
        >
            <img
                style={Object.assign(STATS_DIMENSIONS_IMG_STYLE)}
                src={photo.urls.regular}
            ></img>

            <span
                style={Object.assign(
                    {
                        fontSize: "17.5px",
                        textAlign: "center",
                        width: "100%",
                        top: "8px",
                    },
                    STATS_DIMENSIONS_STYLE
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
                    STATS_DIMENSIONS_STYLE
                )}
            >
                intrinsic
            </span>
        </div>
    );
};

export default StatsDimensions;
