import PixrPlugin from "src/plugin/main";
import { EMBED_TYPES } from "./constants";

export interface StatistcsProps {
    downloads: number[];
    views: number[];
}

export interface DownloadsChartProps {
    chartData: number[];
}

export interface ViewsChartProps {
    chartData: number[];
}

export interface DropdownProps {
    selected: string;
    options: SelectOption[];
    onSelectedChange: (value: string) => void;
    innerRef: any;
    plugin: PixrPlugin;
}

export type SelectOption = {
    [key: string]: string;
};

export type iconsPlot = {
    [key: string]: string;
};

export type Embed = typeof EMBED_TYPES[number];
