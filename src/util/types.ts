import { EMBED_TYPES } from "./constants";

export type SelectOption = {
    [key: string]: string;
};

export type IconsPlot = {
    [key: string]: string;
};

export type Embed = typeof EMBED_TYPES[number];
