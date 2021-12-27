import React from "react";
import * as ReactDOM from "react-dom";
import { App, Menu } from "obsidian";
import MenuTabs from "./statsTabs";
import { setAttributes } from "../util/utils";

export default function statsMenu(
    app: App,
    item: any,
    photo: any,
    blob: any,
    dimensions: any
) {
    const parentElementRect = item.parentElement.getBoundingClientRect();
    const menu = new Menu(app).addItem((item) => {
        item.setTitle("Stats Menu");
        const itemDom = (item as any).dom as HTMLElement;
        itemDom.setAttribute("style", "display: none;");
    });

    const menuDom = (menu as any).dom as HTMLElement;
    ReactDOM.render(
        <MenuTabs photo={photo} blob={blob} dimensions={dimensions} />,
        menuDom
    );
    menuDom.addClass("stats-menu-popover");
    setAttributes(menuDom, {
        style: "min-width: 9.8rem; padding: 0; margin: 0; font-size: 1rem;  text-align: left;  list-style: none; background-color: var(--background-primary); background-clip: padding-box;  border: 1px solid var(--background-modifier-border); border-radius: .42rem;",
    });
    menuDom.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
    });
    menu.showAtPosition({
        x: parentElementRect.right - 160,
        y: parentElementRect.top + 32,
    });
}
