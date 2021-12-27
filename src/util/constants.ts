import { config } from "private";
import { createApi } from "unsplash-js";
import { SelectOption } from "./types";

export const PIXR_VIEW_ = "pixr-view-container";
export const PIXR_VIEW_SIDE = ["right", "left"];
export const EMBED_TYPES = ["markdown", "html"] as const;
export const BYTE_SIZES = ["Bytes", "KB", "MB", "GB", "TB"];
export const SI_SYMBOLS = ["", "k", "M", "G", "T", "P", "E"];

export const UNSPLASH = createApi({
    accessKey: config.UNSPLASH_ACCESSKEY,
});

export const DROPDOWN_OPTIONS: SelectOption = {
    xsmall: "thumb",
    small: "small",
    medium: "regular",
    large: "full",
};

export const LOAD_STATE = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    LOADING: "LOADING",
    SUBMITTED: "SUBMITTED",
};

export const DOWNLOAD_MODAL_STYLE = {
    left: "0",
    right: "0",
    top: "50%",
    margin: "0 auto",
    maxWidth: "480px",
    textAlign: "left" as "left",
    position: "fixed" as "fixed",
    transform: "translateY(-50%)",
};

export const DOWNLOAD_SPANS_STYLE = {
    height: "auto",
    width: "inherit",
    alignItems: "center",
    fontSize: "16.5px",
    cursor: "pointer",
    padding: "0",
    Clear: "both",
    fontWeight: 500,
    TextAlign: "left",
    TextDecoration: "none",
    WhiteSpace: "nowrap",
    gridGap: "8px",
    display: "flex",
    alignContent: "center",
    justifyContent: "start",
    backgroundColor: "transparent",
    borderRadius: 0,
};

export const STATS_DIMENSIONS_STYLE = {
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

export const STATS_DIMENSIONS_IMG_STYLE = {
    height: "100%",
    minWidth: "100%",
    overflow: "hidden",
    cursor: "pointer",
    objectFit: "cover",
    filter: "brightness(0.85) blur(3px)",
    position: "relative" as "relative",
    verticalAlign: "bottom",
};

export const STATS_ICONS_STYLE = {
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
