import { EMBED_TYPES } from "./constants";

export type iconsPlot = {
    [key: string]: string;
};

export type Embed = typeof EMBED_TYPES[number];
